/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import { 
  Box,
  Container,
  Paper, 
  TextField, 
  Button, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  OutlinedInput, 
  Checkbox, 
  ListItemText, 
  FormHelperText,
  InputAdornment,
  CircularProgress,
  IconButton,
  Chip,
  alpha
} from '@mui/material';
import { Laboratorio, Propriedade, FormData, Registro } from '../types';
import useFormWithValidation from '../hooks/useFormWithValidation';
import useFetch from '../hooks/useFetch';
import { registrosApi, laboratoriosApi, propriedadesApi } from '../services/api';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const PageHeader = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
`;

const FormContainer = styled(Paper)`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  width: 100%;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
`;

const FormContent = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.white};
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FormField = styled.div<{ flex?: number }>`
  flex: ${({ flex }) => flex || 1};
  min-width: 280px;
  display: flex;
  flex-direction: column;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
`;

const ChipListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 5px;
`;

const ChipsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 2px;
`;

const CustomSelect = styled(Select)`
  .MuiOutlinedInput-notchedOutline {
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
    border-bottom-width: 1px;
  }
  
  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: rgba(0, 0, 0, 0.87);
    border-width: 0 0 1px 0;
  }
  
  & .MuiSelect-select {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    align-items: center;
    padding-top: 8px;
    padding-bottom: 8px;
    min-height: 56px;
  }
`;

const LabSelect = styled(Select)`
  .MuiOutlinedInput-notchedOutline {
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;
    border-bottom-width: 1px;
  }
  
  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: rgba(0, 0, 0, 0.87);
    border-width: 0 0 1px 0;
  }
  
  & .MuiSelect-select {
    min-height: 56px;
    display: flex;
    align-items: center;
  }
`;

const CustomChip = styled.div`
  display: flex;
  align-items: center;
  background-color: #00a152;
  border-radius: 16px;
  padding: 0 4px 0 10px;
  height: 24px;
  font-size: 13px;
  font-weight: 400;
  color: white;
`;

const ChipLabel = styled.span`
  margin-right: 5px;
`;

const DeleteButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8);
  
  &:hover {
    color: white;
  }
`;

const SelectionCount = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  margin-top: 2px;
`;

const SelectWrapper = styled(FormControl)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const FieldsRow = styled(FormRow)`
  align-items: flex-start;
  min-height: 110px;
`;

const CadastroPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<FormData | undefined>(location.state?.initialData);
  const editingId = location.state?.editingId || id;
  const [selectedPropriedades, setSelectedPropriedades] = useState<number[]>([]);
  const [formKey, setFormKey] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(!!initialData || !!id);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    setValue,
    errors,
    reset,
    watch,
  } = useFormWithValidation(initialData);

  
  const { data: laboratorios, loading: loadingLabs, error: labsError } = useFetch<Laboratorio[]>(
    () => laboratoriosApi.getAll()
  );
  const { data: propriedades, loading: loadingProps, error: propsError } = useFetch<Propriedade[]>(
    () => propriedadesApi.getAll()
  );

  const isLoadingForm = loadingLabs || loadingProps || isLoading;
  const error = labsError || propsError;

  useEffect(() => {
    if (initialData) {
      setIsEditing(true);
      
      const firstMount = formKey === 0;
      if (firstMount) {
        reset(initialData);
        
        if (initialData.propriedades && initialData.propriedades.length > 0) {
          setSelectedPropriedades(initialData.propriedades.map((p: { id: number }) => p.id));
        }
        
        setFormKey(prev => prev + 1);
      }
    }
  }, [initialData, reset, formKey]);

  useEffect(() => {
    if (!isEditing || !initialData?.laboratorio?.nome || !laboratorios) {
      return;
    }
    
    if (Array.isArray(laboratorios) && laboratorios.length > 0) {
      const matchedLab = laboratorios.find(
        lab => lab.nome.toLowerCase() === initialData.laboratorio.nome.toLowerCase()
      );
      
      if (matchedLab) {
        setValue('laboratorio', matchedLab);
      }
    }
  }, [isEditing, initialData, laboratorios, setValue]);

  useEffect(() => {
    if (id && !initialData) {
      loadRegistroForEdit(id);
    }
  }, [id, initialData, reset, navigate, location.state?.editingId]);

  const handlePropriedadesChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedIds = event.target.value as number[];
    setSelectedPropriedades(selectedIds);
    
    const selectedProps = propriedades
      ?.filter(prop => selectedIds.includes(prop.id))
      .map(prop => ({ 
        id: prop.id, 
        nome: prop.nome,
        cnpj: prop.cnpj 
      })) || [];
    
    setValue('propriedades', selectedProps);
  };

  const handleDeletePropriedade = (propId: number) => {
    const newSelectedIds = selectedPropriedades.filter(id => id !== propId);
    setSelectedPropriedades(newSelectedIds);
    
    const selectedProps = propriedades
      ?.filter(prop => newSelectedIds.includes(prop.id))
      .map(prop => ({ 
        id: prop.id, 
        nome: prop.nome,
        cnpj: prop.cnpj 
      })) || [];
    
    setValue('propriedades', selectedProps);
  };

  const onSubmitForm = async (data: FormData) => {
    try {
      setIsLoading(true);
      
      if (!data.propriedades) {
        data.propriedades = [];
      }
      
      if (!data.laboratorio) {
        console.error("Laboratório não selecionado!");
        setIsLoading(false);
        return;
      }
      
      if (data.dataInicial && !data.dataInicial.includes('T')) {
        data.dataInicial = new Date(data.dataInicial).toISOString();
      }
      
      if (data.dataFinal && !data.dataFinal.includes('T')) {
        data.dataFinal = new Date(data.dataFinal).toISOString();
      }
      
      let savedRegistro: Registro;
      
      if (isEditing && editingId) {
        savedRegistro = await registrosApi.update(editingId, data);
      } else {
        savedRegistro = await registrosApi.create(data);
      }
      
      if (savedRegistro) {
        const navState = { 
          formData: data, 
          isEdit: isEditing,
          editingId: editingId,
          timestamp: new Date().getTime(),
          registroJaSalvo: true
        };
        
        navigate('/registros', { 
          state: navState,
          replace: true  
        });
      } else {
        throw new Error("Erro ao salvar registro: resposta vazia do servidor");
      }
    } catch (error) {
      console.error("Erro ao salvar registro:", error);
      alert(`Ocorreu um erro ao salvar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/registros');
  };

  const loadRegistroForEdit = async (id: string) => {
    try {
      setIsLoading(true);
      
      const registro = await registrosApi.getById(id);
      
      if (registro) {
        const formatDate = (dateStr: string) => {
          if (!dateStr) return '';
          
          try {
            if (dateStr.includes('T')) {
              return dateStr.split('T')[0];
            }
            
            if (dateStr.includes('/')) {
              const parts = dateStr.split('/');
              if (parts.length !== 3) return '';
              return `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
            
            return dateStr;
          } catch (e) {
            console.error('Erro ao formatar data:', e);
            return '';
          }
        };
        
        let laboratorioObj: Laboratorio | null = null;
        
        if (typeof registro.laboratorio === 'string') {
          const labName = registro.laboratorio;
          
          if (laboratorios && Array.isArray(laboratorios)) {
            const matchedLab = laboratorios.find(lab => lab.nome === labName);
            if (matchedLab) {
              laboratorioObj = matchedLab;
            }
          }
        } else if (registro.laboratorio && typeof registro.laboratorio === 'object') {
          const labData = registro.laboratorio as Laboratorio;
          
          if (laboratorios && Array.isArray(laboratorios)) {
            const matchedLab = laboratorios.find(lab => lab.id === labData.id);
            if (matchedLab) {
              laboratorioObj = matchedLab;
            } else if (labData.id && labData.nome) {
              laboratorioObj = labData;
            }
          } else if (labData.id && labData.nome) {
            laboratorioObj = labData;
          }
        }
        
        let props: Propriedade[] = [];
        
        if (registro.propriedades && registro.propriedades.length > 0) {
          props = registro.propriedades;
        } else if (registro.propriedadesLista && registro.propriedadesLista.length > 0) {
          props = registro.propriedadesLista;
        } else if (registro.propriedade) {
          const matchingProp = propriedades && registro?.propriedade ? 
            propriedades.find(prop => prop.nome === registro?.propriedade) : undefined;
          if (matchingProp) {
            props = [matchingProp];
          }
        }
        
        const formData: Partial<FormData> = {
          nome: registro.nome,
          dataInicial: formatDate(registro.dataInicial),
          dataFinal: formatDate(registro.dataFinal),
          propriedades: props,
          observacoes: registro.observacoes || ''
        };

        if (laboratorioObj) {
          formData.laboratorio = laboratorioObj;
        }
        
        reset(formData as FormData);
        setInitialData(formData as FormData);
        
        setSelectedPropriedades(props.map(p => p.id));
        setIsLoading(false);
      } else {
        setIsLoading(false);
        
        navigate('/registros');
      }
    } catch (e) {
      console.error('Erro ao carregar dados para edição:', e);
      setIsLoading(false);
      alert('Erro ao carregar o registro. Redirecionando para a lista.');
      navigate('/registros');
    }
  };

  const renderFormContent = () => {
    if (isLoading) {
      return (
        <LoadingContainer>
          <CircularProgress color="primary" />
          <Typography variant="body1" style={{ marginTop: 16 }}>
            Carregando dados...
          </Typography>
        </LoadingContainer>
      );
    }

    if (error) {
      return (
        <Typography color="error" variant="h6" align="center">
          Erro ao carregar dados: {error}
        </Typography>
      );
    }

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <form id="cadastro-form" onSubmit={handleSubmit(onSubmitForm as any)} key={formKey}>
          <FormContent>
            <FormRow>
              <FormField flex={2}>
                <Controller
                  name="nome"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nome *"
                      variant="outlined"
                      fullWidth
                      size="small"
                      error={!!errors.nome}
                      helperText={errors.nome?.message as string}
                    />
                  )}
                />
              </FormField>

              <FormField flex={1}>
                <Controller
                  name="dataInicial"
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => {
                    
                    let dateValue = null;
                    try {
                      if (value) {
                        if (value.includes('T')) {
                          dateValue = new Date(value);
                        } else if (value.includes('/')) { 
                          const parts = value.split('/');
                          dateValue = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                        } else if (value.includes('-')) {
                          dateValue = new Date(value);
                        }
                      }
                    } catch (e) {
                      console.error('Erro ao converter data:', e);
                      dateValue = null;
                    }

                    if (dateValue === null || isNaN(dateValue.getTime())) {
                      dateValue = new Date();
                    }
                    
                    return (
                      <DatePicker
                        label="Data Inicial *"
                        value={dateValue}
                        onChange={(newDate) => {
                          if (newDate) {
                            newDate.setHours(0, 0, 0, 0);
                            onChange(newDate.toISOString());
                          } else {
                            onChange('');
                          }
                        }}
                        format="dd/MM/yyyy"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            error: !!errors.dataInicial,
                            helperText: errors.dataInicial?.message as string,
                            inputProps: { readOnly: true },
                            onBlur,
                            InputProps: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <CalendarTodayIcon color="action" fontSize="small" />
                                </InputAdornment>
                              ),
                            },
                          }
                        }}
                      />
                    );
                  }}
                />
              </FormField>

              <FormField flex={1}>
                <Controller
                  name="dataFinal"
                  control={control}
                  render={({ field: { value, onChange, onBlur } }) => {
                    
                    let dateValue = null;
                    try {
                      if (value) {
                        if (value.includes('T')) { 
                          dateValue = new Date(value);
                        } else if (value.includes('/')) { 
                          const parts = value.split('/');
                          dateValue = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                        } else if (value.includes('-')) { 
                          dateValue = new Date(value);
                        }
                      }
                    } catch (e) {
                      console.error('Erro ao converter data:', e);
                      dateValue = null;
                    }

                    if (dateValue === null || isNaN(dateValue.getTime())) {
                      dateValue = new Date();
                    }
                    
                    return (
                      <DatePicker
                        label="Data Final *"
                        value={dateValue}
                        onChange={(newDate) => {
                          if (newDate) {
                            newDate.setHours(0, 0, 0, 0);
                            onChange(newDate.toISOString());
                          } else {
                            onChange('');
                          }
                        }}
                        format="dd/MM/yyyy"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            error: !!errors.dataFinal,
                            helperText: errors.dataFinal?.message as string,
                            inputProps: { readOnly: true },
                            onBlur,
                            InputProps: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <CalendarTodayIcon color="action" fontSize="small" />
                                </InputAdornment>
                              ),
                            },
                          }
                        }}
                      />
                    );
                  }}
                />
              </FormField>
            </FormRow>

            <FieldsRow>
              <FormField flex={1}>
                <SelectWrapper fullWidth size="small" error={!!errors.propriedades}>
                  <InputLabel id="propriedades-label">Propriedades *</InputLabel>
                  <CustomSelect
                    labelId="propriedades-label"
                    id="propriedades"
                    multiple
                    value={selectedPropriedades}
                    onChange={handlePropriedadesChange as any}
                    input={<OutlinedInput label="Propriedades *" />}
                    renderValue={() => (
                      <>
                        {selectedPropriedades.map((propId) => {
                          const prop = propriedades?.find(p => p.id === propId);
                          return prop ? (
                            <CustomChip key={prop.id}>
                              <ChipLabel>{prop.nome}</ChipLabel>
                              <DeleteButton 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeletePropriedade(prop.id);
                                }}
                              >
                                <CancelIcon 
                                  style={{ fontSize: '16px' }} 
                                  onMouseDown={(e) => e.stopPropagation()}
                                />
                              </DeleteButton>
                            </CustomChip>
                          ) : null;
                        })}
                      </>
                    )}
                    MenuProps={MenuProps}
                  >
                    {propriedades?.map((prop) => (
                      <MenuItem key={prop.id} value={prop.id}>
                        <Checkbox checked={selectedPropriedades.indexOf(prop.id) > -1} />
                        <ListItemText 
                          primary={prop.nome} 
                          secondary={prop.cnpj} 
                        />
                      </MenuItem>
                    ))}
                  </CustomSelect>
                  <SelectionCount>
                    {selectedPropriedades.length} selecionadas
                  </SelectionCount>
                  {errors.propriedades && (
                    <FormHelperText>{errors.propriedades.message as string}</FormHelperText>
                  )}
                </SelectWrapper>
              </FormField>

              <FormField flex={1}>
                <SelectWrapper fullWidth size="small" error={!!errors.laboratorio}>
                  <InputLabel id="laboratorio-label">Laboratório *</InputLabel>
                  <Controller
                    name="laboratorio"
                    control={control}
                    render={({ field }) => {
                      
                      const laboratorioId = field.value && typeof field.value === 'object' ? field.value.id : '';
                      
                      const isValidLabId = laboratorioId && laboratorios && 
                        Array.isArray(laboratorios) && 
                        laboratorios.some(lab => lab.id === laboratorioId);
                      
                      const selectValue = isValidLabId ? laboratorioId : '';
                      
                      return (
                        <LabSelect
                          labelId="laboratorio-label"
                          id="laboratorio"
                          label="Laboratório *"
                          value={selectValue}
                          onChange={(e) => {
                            const value = e.target.value;
                            
                            if (laboratorios && Array.isArray(laboratorios)) {
                              const selectedLab = laboratorios.find(lab => lab.id === value);
                              if (selectedLab) {
                                field.onChange(selectedLab);
                              }
                            }
                          }}
                        >
                          {laboratorios && Array.isArray(laboratorios) && laboratorios.map((lab) => (
                            <MenuItem key={lab.id} value={lab.id}>
                              {lab.nome}
                            </MenuItem>
                          ))}
                        </LabSelect>
                      );
                    }}
                  />
                  {errors.laboratorio && (
                    <FormHelperText>{errors.laboratorio.message as string}</FormHelperText>
                  )}
                </SelectWrapper>
              </FormField>
            </FieldsRow>

            <FormRow>
              <FormField flex={1}>
                <Controller
                  name="observacoes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Observações"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      size="small"
                    />
                  )}
                />
              </FormField>
            </FormRow>
          </FormContent>
        </form>
      </LocalizationProvider>
    );
  };

  return (
    <Box sx={{ 
      backgroundColor: 'background.default', 
      minHeight: 'calc(100vh - 64px)', 
      padding: 2 
    }}>
      <Container maxWidth="xl">
        <FormContainer>
          <PageHeader>
            <HeaderTitle>
              <IconButton color="inherit" onClick={handleCancel} sx={{ mr: 1 }}>
                <KeyboardBackspaceIcon />
              </IconButton>
              <Typography variant="h6">
                Teste Front-End {isEditing ? '/ Editar Cadastro' : ''}
              </Typography>
            </HeaderTitle>
            <Button 
              type="submit"
              form="cadastro-form"
              variant="contained" 
              color="secondary"
              disabled={isLoading}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.2)' } }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  SALVANDO...
                </>
              ) : 'SALVAR'}
            </Button>
          </PageHeader>
          {renderFormContent()}
        </FormContainer>
      </Container>
    </Box>
  );
};

export default CadastroPage; 
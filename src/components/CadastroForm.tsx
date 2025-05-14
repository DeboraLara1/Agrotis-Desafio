import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
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
  CircularProgress
} from '@mui/material';
import { Laboratorio, Propriedade, FormData } from '../types';
import useFormWithValidation from '../hooks/useFormWithValidation';
import useFetch from '../hooks/useFetch';

const LABORATORIOS_URL = 'https://bitbucket.org/agrotis/teste-rh/raw/3bc797776e54586552d1c9666fd7c13366fc9548/teste-front-end-1/laboratorios.json';
const PROPRIEDADES_URL = 'https://bitbucket.org/agrotis/teste-rh/raw/3bc797776e54586552d1c9666fd7c13366fc9548/teste-front-end-1/propriedades.json';

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

interface CadastroFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  initialData?: FormData;
  open: boolean;
}

const FormTitle = styled(Typography)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-weight: 500;
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
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

const CadastroForm: React.FC<CadastroFormProps> = ({ onSubmit, onCancel, initialData, open }) => {
  const [selectedPropriedades, setSelectedPropriedades] = useState<number[]>([]);
  const [isDateInicialOpen, setIsDateInicialOpen] = useState(false);
  const [isDateFinalOpen, setIsDateFinalOpen] = useState(false);
  
  const [dataInicialValue, setDataInicialValue] = useState<Date | null>(null);
  const [dataFinalValue, setDataFinalValue] = useState<Date | null>(null);

  const {
    handleSubmit,
    control,
    setValue,
    errors,
    reset,
  } = useFormWithValidation(initialData);

  const { data: laboratorios, loading: loadingLabs, error: labsError } = useFetch<Laboratorio[]>(LABORATORIOS_URL);
  const { data: propriedades, loading: loadingProps, error: propsError } = useFetch<Propriedade[]>(PROPRIEDADES_URL);

  const isLoading = loadingLabs || loadingProps;
  const error = labsError || propsError;

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      
      if (initialData.propriedades && initialData.propriedades.length > 0) {
        setSelectedPropriedades(initialData.propriedades.map(p => p.id));
      }
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (initialData && initialData.laboratorio && laboratorios) {
      if (initialData.laboratorio.id === 0 || !initialData.laboratorio.id) {
        const matchedLab = laboratorios.find((lab: Laboratorio) => 
          lab.nome === initialData.laboratorio.nome
        );
        
        if (matchedLab) {
          setValue('laboratorio', matchedLab);
        }
      }
    }
  }, [initialData, laboratorios, setValue]);

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

  const onSubmitForm = (data: FormData) => {
    onSubmit(data);
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
        <form onSubmit={handleSubmit(onSubmitForm as any)}>
          <FormRow>
            <FormField flex={1}>
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
          </FormRow>

          <FormRow>
            <FormField>
              <Controller
                name="dataInicial"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label="Data Inicial *"
                    value={value ? new Date(value) : null}
                    onChange={(date) => {
                      onChange(date?.toISOString() || '');
                    }}
                    format="dd/MM/yyyy"
                    open={isDateInicialOpen}
                    onOpen={() => setIsDateInicialOpen(true)}
                    onClose={() => setIsDateInicialOpen(false)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        error: !!errors.dataInicial,
                        helperText: errors.dataInicial?.message as string,
                        placeholder: "dd/mm/aaaa",
                        onClick: () => setIsDateInicialOpen(true),
                        InputProps: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <CalendarTodayIcon 
                                color="action" 
                                fontSize="small"
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsDateInicialOpen(true);
                                }}
                              />
                            </InputAdornment>
                          )
                        }
                      },
                      day: {
                        sx: {
                          "&.Mui-selected": {
                            backgroundColor: "#00A884",
                            color: "white"
                          }
                        }
                      }
                    }}
                    sx={{
                      '& .MuiPickersDay-root': {
                        borderRadius: '50%',
                      },
                      '& .MuiPickersDay-root.Mui-selected': {
                        backgroundColor: '#00A884',
                        color: 'white',
                      },
                      '& .MuiPickersDay-today': {
                        color: '#00A884',
                      },
                      '& .MuiDayCalendar-weekDayLabel': {
                        color: '#666',
                      },
                      '& .MuiPickersCalendarHeader-label': {
                        color: '#000',
                        fontWeight: 'bold',
                      },
                    }}
                  />
                )}
              />
            </FormField>

            <FormField>
              <Controller
                name="dataFinal"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker
                    label="Data Final *"
                    value={value ? new Date(value) : null}
                    defaultValue={initialData?.dataFinal ? new Date(initialData.dataFinal) : null}
                    onChange={(date) => {
                      onChange(date?.toISOString() || '');
                      setDataFinalValue(date);
                    }}
                    format="dd/MM/yyyy"
                    open={isDateFinalOpen}
                    onOpen={() => setIsDateFinalOpen(true)}
                    onClose={() => setIsDateFinalOpen(false)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        error: !!errors.dataFinal,
                        helperText: errors.dataFinal?.message as string,
                        placeholder: "dd/mm/aaaa",
                        onClick: () => setIsDateFinalOpen(true),
                        InputProps: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <CalendarTodayIcon 
                                color="action" 
                                fontSize="small"
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsDateFinalOpen(true);
                                }}
                              />
                            </InputAdornment>
                          )
                        }
                      },
                      day: {
                        sx: {
                          "&.Mui-selected": {
                            backgroundColor: "#00A884",
                            color: "white"
                          }
                        }
                      }
                    }}
                    sx={{
                      '& .MuiPickersDay-root': {
                        borderRadius: '50%',
                      },
                      '& .MuiPickersDay-root.Mui-selected': {
                        backgroundColor: '#00A884',
                        color: 'white',
                      },
                      '& .MuiPickersDay-today': {
                        color: '#00A884',
                      },
                      '& .MuiDayCalendar-weekDayLabel': {
                        color: '#666',
                      },
                      '& .MuiPickersCalendarHeader-label': {
                        color: '#000',
                        fontWeight: 'bold',
                      },
                    }}
                  />
                )}
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField>
              <FormControl fullWidth size="small" error={!!errors.propriedades}>
                <InputLabel id="propriedades-label">Propriedades *</InputLabel>
                <Select
                  labelId="propriedades-label"
                  id="propriedades"
                  multiple
                  value={selectedPropriedades}
                  onChange={handlePropriedadesChange as any}
                  input={<OutlinedInput label="Propriedades *" />}
                  renderValue={(selected) => {
                    const selectedItems = propriedades?.filter(prop => 
                      (selected as number[]).includes(prop.id)
                    ) || [];
                    
                    return selectedItems.map(item => item.nome).join(', ');
                  }}
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
                </Select>
                {errors.propriedades && (
                  <FormHelperText>{errors.propriedades.message as string}</FormHelperText>
                )}
              </FormControl>
            </FormField>

            <FormField>
              <FormControl fullWidth size="small" error={!!errors.laboratorio}>
                <InputLabel id="laboratorio-label">Laboratório *</InputLabel>
                <Controller
                  name="laboratorio"
                  control={control}
                  render={({ field }) => (
                    <Select
                      labelId="laboratorio-label"
                      id="laboratorio"
                      label="Laboratório *"
                      value={field.value?.id || ''}
                      onChange={(e) => {
                        const selectedLab = laboratorios?.find(lab => lab.id === e.target.value);
                        field.onChange(selectedLab);
                      }}
                    >
                      {laboratorios?.map((lab) => (
                        <MenuItem key={lab.id} value={lab.id}>
                          {lab.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.laboratorio && (
                  <FormHelperText>{errors.laboratorio.message as string}</FormHelperText>
                )}
              </FormControl>
            </FormField>
          </FormRow>

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

          <FormActions>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
            >
              Salvar
            </Button>
          </FormActions>
        </form>
      </LocalizationProvider>
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onCancel}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: { borderRadius: 8 }
      }}
    >
      <DialogTitle>
        <FormTitle variant="h5">
          {initialData ? 'Editar cadastro' : 'Cadastrar'}
        </FormTitle>
      </DialogTitle>
      <DialogContent>
        {renderFormContent()}
      </DialogContent>
    </Dialog>
  );
};

export default CadastroForm; 
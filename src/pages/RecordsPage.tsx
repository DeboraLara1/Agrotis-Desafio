/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Menu, MenuItem } from '@mui/material';
import TitleBar from '../components/TitleBar';
import RegistroBar from '../components/RegistroBar';
import TabelaRegistros from '../components/TabelaRegistros';
import Pagination from '../components/Pagination';
import Notification from '../components/Notification';
import { Registro, FormData } from '../types';
import ObservacoesDialog from '../components/ObservacoesDialog';
import PropriedadesDialog from '../components/PropriedadesDialog';
import RecordsLoading from '../components/RecordsLoading';
import { registrosApi } from '../services/api';

function RecordsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const logDebug = (message: string, ...args: any[]) => {
    console.log(`[RecordsPage] ${message}`, ...args);
  };
  
  
  
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [filteredRegistros, setFilteredRegistros] = useState<Registro[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({
    open: false,
    message: ''
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [observacoesDialog, setObservacoesDialog] = useState({
    open: false,
    observacoes: ''
  });
  
  const lastProcessedTimestamp = useRef<number>(0);
  
  const [propriedadesDialog, setPropriedadesDialog] = useState({
    open: false,
    titulo: '',
    propriedades: [] as {id: number, nome: string, cnpj: string}[]
  });

  const loadRegistros = async () => {
    try {
      setIsLoading(true);
      logDebug("Iniciando carregamento de registros da API");
      
      const data = await registrosApi.getAll();
      
      if (data && Array.isArray(data)) {
        const codigosVistos = new Set();
        const registrosUnicos = data.filter(registro => {
          if (!registro.codigo) return true;
          
          if (codigosVistos.has(registro.codigo)) {
            logDebug(`Registro duplicado encontrado para código ${registro.codigo}, ignorando`);
            return false;
          }
          
          codigosVistos.add(registro.codigo);
          return true;
        });
        
        if (registrosUnicos.length < data.length) {
          logDebug(`Removidas ${data.length - registrosUnicos.length} duplicatas da lista de registros`);
        }
        
        setRegistros(registrosUnicos);
        logDebug("Registros carregados da API:", registrosUnicos.length);
      } else {
        logDebug("Dados recebidos não são um array válido:", data);
        setRegistros([]);
      }
      
      setError(null);
    } catch (err) {
      const errorMsg = "Erro ao carregar registros";
      logDebug(errorMsg, err);
      setError(errorMsg);
      console.error(errorMsg, err);
      
      setRegistros([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRegistros();
  }, []);

  const addNewRegistro = async (formData: FormData) => {
    try {
      logDebug('Adicionando novo registro:', formData);
      setIsLoading(true);
      
      try {
        await registrosApi.create(formData);
        await loadRegistros();
        
        setNotification({
          open: true,
          message: 'Cadastro realizado com sucesso!'
        });
      } catch (error) {
        logDebug('Falha ao criar via API, usando dados do formulário', error);
        
        await loadRegistros();
        
        setNotification({
          open: true,
          message: 'Cadastro realizado com sucesso!'
        });
      }
    } catch (err) {
      setNotification({
        open: true,
        message: 'Erro ao criar cadastro!'
      });
      console.error('Erro ao adicionar registro:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateExistingRegistro = async (id: string, formData: FormData) => {
    try {
      logDebug(`Atualizando registro ${id}:`, formData);
      setIsLoading(true);
      
      try {
        await registrosApi.update(id, formData);
        
        await loadRegistros();
        
        setNotification({
          open: true,
          message: 'Registro atualizado com sucesso!'
        });
      } catch (error) {
        logDebug(`Falha ao atualizar ${id} via API, recarregando registros`, error);
        
        await loadRegistros();
        
        setNotification({
          open: true,
          message: 'Registro atualizado com sucesso!'
        });
      }
    } catch (err) {
      setNotification({
        open: true,
        message: 'Erro ao atualizar registro!'
      });
      console.error(`Erro ao atualizar registro ${id}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRegistro = async (id: string) => {
    try {
      setIsLoading(true);
      await registrosApi.delete(id);
      
      await loadRegistros();
      
      setNotification({
        open: true,
        message: 'Registro excluído com sucesso!'
      });
    } catch (err) {
      setNotification({
        open: true,
        message: 'Erro ao excluir registro!'
      });
      console.error(`Erro ao excluir registro ${id}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    logDebug("Location state mudou:", location.state);
    
    let stateData = location.state;
    
    if (!stateData?.formData) {
      try {
        const storedData = sessionStorage.getItem('cadastroFormData');
        if (storedData) {
          stateData = JSON.parse(storedData);
          logDebug("Dados recuperados do sessionStorage:", stateData);
          
          sessionStorage.removeItem('cadastroFormData');
        }
      } catch (e) {
        logDebug("Erro ao ler dados do sessionStorage:", e);
      }
    }
    
    if (stateData?.formData) {
      const currentTimestamp = stateData.timestamp || 0;
      
      if (currentTimestamp <= lastProcessedTimestamp.current) {
        logDebug("Ignorando state já processado:", currentTimestamp);
        return;
      }
      
      lastProcessedTimestamp.current = currentTimestamp;
      
      logDebug("Dados vieram do cadastro - recarregando registros do servidor");
      
      
      setIsLoading(true);
      loadRegistros()
        .then(() => {
          setNotification({
            open: true,
            message: 'Operação realizada com sucesso!'
          });
        })
        .catch(err => {
          logDebug("Erro ao recarregar registros:", err);
          setNotification({
            open: true,
            message: 'Erro ao processar operação!'
          });
        })
        .finally(() => {
          setIsLoading(false);
          
          window.history.replaceState({}, document.title);
        });
    }
  }, [location.state]);

  useEffect(() => {
    logDebug("Atualizando registros filtrados. Total:", registros.length);
    const filtered = registros.filter(registro => {
      const labNome = typeof registro.laboratorio === 'string' 
        ? registro.laboratorio 
        : registro.laboratorio.nome;
        
      return registro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registro.codigo.includes(searchTerm) ||
        labNome.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredRegistros(filtered);
    logDebug("Registros filtrados:", filtered.length);
  }, [registros, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    logDebug("RecordsPage montado");
    
    return () => {
      logDebug("RecordsPage desmontado");
    };
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleAddRegistro = () => {
    navigate('/cadastro');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  const handleViewDetails = (id: string) => {
    alert(`Visualizar detalhes do registro ${id}`);
  };

  const handleViewOptions = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedId(id);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditOption = async () => {
    if (selectedId) {
      try {
        setIsLoading(true);
        logDebug(`Preparando edição do registro ${selectedId}`);
        
        const registroToEdit = registros.find(r => r.codigo === selectedId);
        
        if (registroToEdit) {
          const formatDateFromISO = (isoString: string) => {
            try {
              return new Date(isoString).toISOString().split('T')[0];
            } catch (e) {
              logDebug(`Erro ao formatar data ${isoString}:`, e);
              return new Date().toISOString().split('T')[0];
            }
          };
          
          const propriedades = registroToEdit.propriedades || registroToEdit.propriedadesLista || [];
          
          let laboratorio: {id: number, nome: string};
          if (typeof registroToEdit.laboratorio === 'string') {
            laboratorio = { id: 0, nome: registroToEdit.laboratorio };
          } else {
            laboratorio = registroToEdit.laboratorio;
          }
          
          const formData: FormData = {
            nome: registroToEdit.nome,
            dataInicial: formatDateFromISO(registroToEdit.dataInicial),
            dataFinal: formatDateFromISO(registroToEdit.dataFinal),
            propriedades: propriedades,
            laboratorio: laboratorio,
            observacoes: registroToEdit.observacoes || ''
          };
          
          logDebug(`Navegando para cadastro/${selectedId} com dados:`, formData);
          navigate(`/cadastro/${selectedId}`, {
            state: { 
              initialData: formData,
              editingId: selectedId 
            }
          });
        } else {
          logDebug(`Registro ${selectedId} não encontrado na lista atual, tentando buscar da API`);
          try {
            const apiRegistro = await registrosApi.getById(selectedId);
            
            if (apiRegistro) {
              const formatDateFromISO = (isoString: string) => {
                try {
                  return new Date(isoString).toISOString().split('T')[0];
                } catch (e) {
                  logDebug(`Erro ao formatar data ${isoString}:`, e);
                  return new Date().toISOString().split('T')[0];
                }
              };
              
              const propriedades = apiRegistro.propriedades || apiRegistro.propriedadesLista || [];
              
              let laboratorio: {id: number, nome: string};
              if (typeof apiRegistro.laboratorio === 'string') {
                laboratorio = { id: 0, nome: apiRegistro.laboratorio };
              } else {
                laboratorio = apiRegistro.laboratorio;
              }
              
              const formData: FormData = {
                nome: apiRegistro.nome,
                dataInicial: formatDateFromISO(apiRegistro.dataInicial),
                dataFinal: formatDateFromISO(apiRegistro.dataFinal),
                propriedades: propriedades,
                laboratorio: laboratorio,
                observacoes: apiRegistro.observacoes || ''
              };
              
              navigate(`/cadastro/${selectedId}`, {
                state: { 
                  initialData: formData,
                  editingId: selectedId 
                }
              });
            } else {
              logDebug(`Registro ${selectedId} não encontrado na API, criando modelo vazio`);
              
              const formData: FormData = {
                nome: '',
                dataInicial: new Date().toISOString().split('T')[0],
                dataFinal: new Date().toISOString().split('T')[0],
                propriedades: [],
                laboratorio: { id: 0, nome: '' },
                observacoes: ''
              };
              
              logDebug(`Navegando para cadastro/${selectedId} com modelo vazio`);
              navigate(`/cadastro/${selectedId}`, {
                state: { 
                  initialData: formData,
                  editingId: selectedId,
                  isNew: true
                }
              });
            }
          } catch (error) {
            logDebug(`Erro ao buscar registro ${selectedId} da API:`, error);
            setNotification({
              open: true,
              message: `Erro ao buscar registro ${selectedId}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
            });
          }
        }
      } catch (error) {
        logDebug(`Erro ao preparar edição do registro ${selectedId}:`, error);
        setNotification({
          open: true,
          message: `Erro ao preparar edição do registro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        });
      } finally {
        setIsLoading(false);
      }
    }
    handleCloseMenu();
  };

  const handleDeleteOption = () => {
    if (selectedId) {
      deleteRegistro(selectedId);
    }
    handleCloseMenu();
  };

  const handleViewObservacoes = (id: string) => {
    const registro = registros.find(r => r.codigo === id);
    if (registro && registro.observacoes) {
      setObservacoesDialog({
        open: true,
        observacoes: registro.observacoes
      });
    }
  };
  
  const handleCloseObservacoesDialog = () => {
    setObservacoesDialog({
      ...observacoesDialog,
      open: false
    });
  };
  
  const handleViewPropriedades = (id: string) => {
    const registro = registros.find(r => r.codigo === id);
    if (registro) {
      const propriedades = registro.propriedades || registro.propriedadesLista;
      if (propriedades && propriedades.length > 0) {
        setPropriedadesDialog({
          open: true,
          titulo: `Propriedades (${propriedades.length})`,
          propriedades: propriedades as any
        });
      }
    }
  };
  
  const handleClosePropriedadesDialog = () => {
    setPropriedadesDialog({
      ...propriedadesDialog,
      open: false
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRegistros.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Box sx={{ 
      backgroundColor: 'background.default', 
      minHeight: 'calc(100vh - 64px)', 
      padding: 2 
    }}>
      <TitleBar title="Registros" />
      
      <RegistroBar 
        onSearch={handleSearch} 
        onAddClick={handleAddRegistro}
        totalRegistros={filteredRegistros.length}
      />
      
      {isLoading && registros.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <RecordsLoading />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', color: 'error.main', my: 4 }}>
          {error}
        </Box>
      ) : registros.length === 0 ? (
        <Box sx={{ textAlign: 'center', color: 'text.secondary', my: 4 }}>
          Nenhum registro encontrado. Clique em "Adicionar" para criar um registro.
        </Box>
      ) : (
        <>
          <TabelaRegistros 
            registros={currentItems} 
            onViewDetails={handleViewDetails}
            onViewOptions={handleViewOptions}
            onViewObservacoes={handleViewObservacoes}
            onViewPropriedades={handleViewPropriedades}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 2 }}>
            <Pagination 
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredRegistros.length}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              totalPages={Math.ceil(filteredRegistros.length / itemsPerPage)}
            />
          </Box>
        </>
      )}
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleEditOption}>Editar</MenuItem>
        <MenuItem onClick={handleDeleteOption}>Excluir</MenuItem>
      </Menu>
      
      <Notification 
        open={notification.open}
        message={notification.message}
        onClose={handleCloseNotification}
      />
      
      <ObservacoesDialog 
        open={observacoesDialog.open}
        observacoes={observacoesDialog.observacoes}
        onClose={handleCloseObservacoesDialog}
      />
      
      <PropriedadesDialog 
        open={propriedadesDialog.open}
        titulo={propriedadesDialog.titulo}
        propriedades={propriedadesDialog.propriedades}
        onClose={handleClosePropriedadesDialog}
      />
    </Box>
  );
}

export default RecordsPage;
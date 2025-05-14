/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Menu, MenuItem } from '@mui/material';
import Header from './components/Header';
import TitleBar from './components/TitleBar';
import RegistroBar from './components/RegistroBar';
import TabelaRegistros from './components/TabelaRegistros';
import Pagination from './components/Pagination';
import Notification from './components/Notification';
import CadastroForm from './components/CadastroForm';
import ObservacoesDialog from './components/ObservacoesDialog';
import PropriedadesDialog from './components/PropriedadesDialog';
import { mockRegistros } from './mockData';
import { Registro, FormData } from './types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00A884',
    },
    secondary: {
      main: '#F50057',
    },
    background: {
      default: '#F5F5F5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
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
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRegistro, setCurrentRegistro] = useState<Registro | null>(null);
  
  // States for dialogs
  const [observacoesDialog, setObservacoesDialog] = useState({
    open: false,
    observacoes: ''
  });
  
  const [propriedadesDialog, setPropriedadesDialog] = useState({
    open: false,
    titulo: '',
    propriedades: [] as {id: number, nome: string, cnpj: string}[]
  });

  useEffect(() => {
    // Simulando carregamento de dados
    setTimeout(() => {
      setRegistros(mockRegistros);
      setFilteredRegistros(mockRegistros);
    }, 500);
  }, []);

  useEffect(() => {
    const filtered = registros.filter(registro => {
      // Verificar se laboratorio é string ou objeto
      const labNome = typeof registro.laboratorio === 'string' 
        ? registro.laboratorio 
        : registro.laboratorio.nome;
      
      return registro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registro.codigo.includes(searchTerm) ||
        labNome.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredRegistros(filtered);
    setCurrentPage(1);
  }, [searchTerm, registros]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleAddRegistro = () => {
    setEditMode(false);
    setCurrentRegistro(null);
    setShowForm(true);
  };

  const handleFormSubmit = (formData: FormData) => {
    if (editMode && currentRegistro) {
      // Update existing registro
      const updatedRegistros = registros.map(reg => 
        reg.codigo === currentRegistro.codigo 
          ? {
              ...reg,
              nome: formData.nome,
              dataInicial: new Date(formData.dataInicial).toLocaleDateString('pt-BR'),
              dataFinal: new Date(formData.dataFinal).toLocaleDateString('pt-BR'),
              propriedade: formData.propriedades.length > 0 
                ? formData.propriedades[0].nome 
                : '',
              propriedadesCount: formData.propriedades.length > 1 
                ? formData.propriedades.length 
                : undefined,
              propriedadesLista: formData.propriedades,
              laboratorio: formData.laboratorio.nome,
              observacoes: formData.observacoes
            }
          : reg
      );
      
      setRegistros(updatedRegistros);
      setFilteredRegistros(updatedRegistros);
      
      setNotification({
        open: true,
        message: 'Registro atualizado com sucesso!'
      });
    } else {
      // Generate a unique code for the new registro
      const newCodigo = Math.floor(Math.random() * 1000).toString().padStart(4, '0');
      
      // Create a new registro from the form data
      const newRegistro: Registro = {
        codigo: newCodigo,
        nome: formData.nome,
        dataInicial: new Date(formData.dataInicial).toLocaleDateString('pt-BR'),
        dataFinal: new Date(formData.dataFinal).toLocaleDateString('pt-BR'),
        propriedade: formData.propriedades.length > 0 
          ? formData.propriedades[0].nome 
          : '',
        propriedadesCount: formData.propriedades.length > 1 
          ? formData.propriedades.length 
          : undefined,
        propriedadesLista: formData.propriedades,
        laboratorio: formData.laboratorio.nome,
        observacoes: formData.observacoes
      };
      
      // Add the new registro to the list
      setRegistros([newRegistro, ...registros]);
      setFilteredRegistros([newRegistro, ...filteredRegistros]);
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Cadastro realizado com sucesso!'
      });
    }
    
    // Hide the form and reset edit mode
    setShowForm(false);
    setEditMode(false);
    setCurrentRegistro(null);
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
    if (registro && registro.propriedadesLista && registro.propriedadesLista.length > 0) {
      setPropriedadesDialog({
        open: true,
        titulo: `Propriedades (${registro.propriedadesLista.length})`,
        propriedades: registro.propriedadesLista as any
      });
    }
  };
  
  const handleClosePropriedadesDialog = () => {
    setPropriedadesDialog({
      ...propriedadesDialog,
      open: false
    });
  };

  const handleViewOptions = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedId(id);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleEditOption = () => {
    if (selectedId) {
      const registroToEdit = registros.find(r => r.codigo === selectedId);
      if (registroToEdit) {
        setCurrentRegistro(registroToEdit);
        setEditMode(true);
        setShowForm(true);
      }
    }
    handleCloseMenu();
  };

  const handleDeleteOption = () => {
    if (selectedId) {
      const updatedRegistros = registros.filter(r => r.codigo !== selectedId);
      setRegistros(updatedRegistros);
      setFilteredRegistros(updatedRegistros);
      
      setNotification({
        open: true,
        message: 'Registro excluído com sucesso!'
      });
    }
    handleCloseMenu();
  };

  // Cálculo para paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRegistros.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRegistros.length / itemsPerPage);

  // Prepare data for CadastroForm when in edit mode
  const prepareFormData = (): FormData | undefined => {
    if (editMode && currentRegistro) {
      // Determinar o nome do laboratório como string
      const labNome = typeof currentRegistro.laboratorio === 'string'
        ? currentRegistro.laboratorio
        : currentRegistro.laboratorio.nome;
      
      return {
        nome: currentRegistro.nome,
        dataInicial: new Date(currentRegistro.dataInicial.split('/').reverse().join('-')).toISOString(),
        dataFinal: new Date(currentRegistro.dataFinal.split('/').reverse().join('-')).toISOString(),
        propriedades: currentRegistro.propriedadesLista || 
          (currentRegistro.propriedade ? [{ id: 0, nome: currentRegistro.propriedade, cnpj: '00.000.000/0000-00' }] : []),
        laboratorio: { 
          id: 0, 
          nome: labNome
        },
        observacoes: currentRegistro.observacoes || ''
      };
    }
    return undefined;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <TitleBar 
          isEdit={showForm && editMode}
          onBack={() => showForm ? setShowForm(false) : null} 
        />
        
        {showForm ? (
          <CadastroForm 
            open={showForm}
            onSubmit={handleFormSubmit} 
            initialData={prepareFormData()}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <RegistroBar 
              totalRegistros={filteredRegistros.length} 
              onAddClick={handleAddRegistro} 
              onSearch={handleSearch}
            />
            
            <Box sx={{ flex: 1 }}>
              <TabelaRegistros 
                registros={currentItems} 
                onViewDetails={handleViewObservacoes}
                onViewOptions={handleViewOptions}
                onViewObservacoes={handleViewObservacoes}
                onViewPropriedades={handleViewPropriedades}
              />
            </Box>
            
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredRegistros.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </Box>
        )}
        
        <Notification 
          open={notification.open}
          message={notification.message}
          onClose={handleCloseNotification}
        />
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={handleEditOption}>Editar</MenuItem>
          <MenuItem onClick={handleDeleteOption}>Excluir</MenuItem>
        </Menu>
        
        <ObservacoesDialog 
          open={observacoesDialog.open}
          onClose={handleCloseObservacoesDialog}
          observacoes={observacoesDialog.observacoes}
        />
        
        <PropriedadesDialog 
          open={propriedadesDialog.open}
          onClose={handleClosePropriedadesDialog}
          propriedades={propriedadesDialog.propriedades}
          titulo={propriedadesDialog.titulo}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App; 
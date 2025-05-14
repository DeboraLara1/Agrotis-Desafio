import React from 'react';
import styled from 'styled-components';
import useRegistros from '../hooks/useRegistros';
import usePagination from '../hooks/usePagination';
import Header from './Header';
import TitleBar from './TitleBar';
import RegistroBar from './RegistroBar';
import TabelaRegistros from './TabelaRegistros';
import Pagination from './Pagination';
import Notification from './Notification';
import CadastroForm from './CadastroForm';
import ObservacoesDialog from './ObservacoesDialog';
import PropriedadesDialog from './PropriedadesDialog';
import { Menu, MenuItem } from '@mui/material';

const TodoContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Todo: React.FC = () => {
  const {
    filteredRegistros,
    notification,
    observacoesDialog,
    propriedadesDialog,
    selectedId,
    showForm,
    editMode,
    currentRegistro,
    setNotification,
    setObservacoesDialog,
    setPropriedadesDialog,
    setSelectedId,
    setShowForm,
    setEditMode,
    setCurrentRegistro,
    setSearchTerm,
    addRegistro,
    updateRegistro,
    deleteRegistro,
    findRegistroById,
  } = useRegistros();

  const {
    currentItems,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    setCurrentPage,
    setItemsPerPage,
  } = usePagination(filteredRegistros, {
    initialPage: 1,
    initialItemsPerPage: 10
  });

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleViewDetails = (id: string) => {
    alert(`Visualizar detalhes do registro ${id}`);
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
      const registroToEdit = findRegistroById(selectedId);
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
      deleteRegistro(selectedId);
    }
    handleCloseMenu();
  };

  const handleViewObservacoes = (id: string) => {
    const registro = findRegistroById(id);
    if (registro && registro.observacoes) {
      setObservacoesDialog({
        open: true,
        observacoes: registro.observacoes,
      });
    }
  };

  const handleCloseObservacoesDialog = () => {
    setObservacoesDialog({
      ...observacoesDialog,
      open: false,
    });
  };

  const handleViewPropriedades = (id: string) => {
    const registro = findRegistroById(id);
    if (registro && registro.propriedadesLista && registro.propriedadesLista.length > 0) {
      setPropriedadesDialog({
        open: true,
        titulo: `Propriedades (${registro.propriedadesLista.length})`,
        propriedades: registro.propriedadesLista as any,
      });
    }
  };

  const handleClosePropriedadesDialog = () => {
    setPropriedadesDialog({
      ...propriedadesDialog,
      open: false,
    });
  };

  const handleAddRegistro = () => {
    setEditMode(false);
    setCurrentRegistro(null);
    setShowForm(true);
  };

  const handleFormSubmit = (formData: any) => {
    if (editMode && currentRegistro) {
      updateRegistro(formData);
    } else {
      addRegistro(formData);
    }
    setShowForm(false);
    setEditMode(false);
    setCurrentRegistro(null);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditMode(false);
    setCurrentRegistro(null);
  };

  return (
    <TodoContainer>
      <Header />
      <MainContent>
        {showForm ? (
          <CadastroForm
            open={showForm}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            initialData={currentRegistro ? prepareFormData(currentRegistro) : undefined}
          />
        ) : (
          <>
            <TitleBar />
            <RegistroBar onSearch={handleSearch} onAddClick={handleAddRegistro} />
            <TabelaRegistros
              registros={currentItems}
              onViewDetails={handleViewDetails}
              onViewOptions={handleViewOptions}
              onViewObservacoes={handleViewObservacoes}
              onViewPropriedades={handleViewPropriedades}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </>
        )}
      </MainContent>

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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEditOption}>Editar</MenuItem>
        <MenuItem onClick={handleDeleteOption}>Excluir</MenuItem>
      </Menu>
    </TodoContainer>
  );
};

const prepareFormData = (registro: any) => {
  return {
    nome: registro.nome,
    dataInicial: parseDataBrToIso(registro.dataInicial),
    dataFinal: parseDataBrToIso(registro.dataFinal),
    propriedades: registro.propriedadesLista || [],
    laboratorio: { id: 0, nome: registro.laboratorio },
    observacoes: registro.observacoes || '',
  };
};

const parseDataBrToIso = (dataBr: string) => {
  if (!dataBr) return new Date().toISOString();

  const [day, month, year] = dataBr.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toISOString();
};

export default Todo; 
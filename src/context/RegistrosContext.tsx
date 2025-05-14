import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Registro, FormData, Propriedade } from '../types';
import { mockRegistros } from '../mockData';

interface RegistrosContextProps {
  registros: Registro[];
  filteredRegistros: Registro[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  notification: {
    open: boolean;
    message: string;
  };
  observacoesDialog: {
    open: boolean;
    observacoes: string;
  };
  propriedadesDialog: {
    open: boolean;
    titulo: string;
    propriedades: Propriedade[];
  };
  selectedId: string | null;
  showForm: boolean;
  editMode: boolean;
  currentRegistro: Registro | null;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (perPage: number) => void;
  setNotification: (notification: { open: boolean; message: string }) => void;
  setObservacoesDialog: (dialog: { open: boolean; observacoes: string }) => void;
  setPropriedadesDialog: (dialog: {
    open: boolean;
    titulo: string;
    propriedades: Propriedade[];
  }) => void;
  setSelectedId: (id: string | null) => void;
  setShowForm: (show: boolean) => void;
  setEditMode: (edit: boolean) => void;
  setCurrentRegistro: (registro: Registro | null) => void;
  addRegistro: (formData: FormData) => void;
  updateRegistro: (formData: FormData) => void;
  deleteRegistro: (id: string) => void;
  findRegistroById: (id: string) => Registro | undefined;
}

interface RegistrosProviderProps {
  children: ReactNode;
}

export const RegistrosContext = createContext<RegistrosContextProps>({} as RegistrosContextProps);

export const RegistrosProvider: React.FC<RegistrosProviderProps> = ({ children }) => {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [filteredRegistros, setFilteredRegistros] = useState<Registro[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
  });
  const [observacoesDialog, setObservacoesDialog] = useState({
    open: false,
    observacoes: '',
  });
  const [propriedadesDialog, setPropriedadesDialog] = useState({
    open: false,
    titulo: '',
    propriedades: [] as Propriedade[],
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRegistro, setCurrentRegistro] = useState<Registro | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setRegistros(mockRegistros);
      setFilteredRegistros(mockRegistros);
    }, 500);
  }, []);

  useEffect(() => {
    const filtered = registros.filter(
      (registro) => {
        const labNome = typeof registro.laboratorio === 'string' 
          ? registro.laboratorio 
          : registro.laboratorio.nome;
        
        return registro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          registro.codigo.includes(searchTerm) ||
          labNome.toLowerCase().includes(searchTerm.toLowerCase());
      }
    );
    setFilteredRegistros(filtered);
    setCurrentPage(1);
  }, [searchTerm, registros]);

  const addRegistro = (formData: FormData) => {
    const newCodigo = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(4, '0');

    const newRegistro: Registro = {
      codigo: newCodigo,
      nome: formData.nome,
      dataInicial: new Date(formData.dataInicial).toLocaleDateString('pt-BR'),
      dataFinal: new Date(formData.dataFinal).toLocaleDateString('pt-BR'),
      propriedade: formData.propriedades.length > 0 ? formData.propriedades[0].nome : '',
      propriedadesCount:
        formData.propriedades.length > 1 ? formData.propriedades.length : undefined,
      propriedadesLista: formData.propriedades,
      laboratorio: formData.laboratorio.nome,
      observacoes: formData.observacoes,
    };

    setRegistros([newRegistro, ...registros]);

    setNotification({
      open: true,
      message: 'Cadastro realizado com sucesso!',
    });
  };

  const updateRegistro = (formData: FormData) => {
    if (!currentRegistro) return;

    const updatedRegistros = registros.map((reg) =>
      reg.codigo === currentRegistro.codigo
        ? {
            ...reg,
            nome: formData.nome,
            dataInicial: new Date(formData.dataInicial).toLocaleDateString('pt-BR'),
            dataFinal: new Date(formData.dataFinal).toLocaleDateString('pt-BR'),
            propriedade: formData.propriedades.length > 0 ? formData.propriedades[0].nome : '',
            propriedadesCount:
              formData.propriedades.length > 1 ? formData.propriedades.length : undefined,
            propriedadesLista: formData.propriedades,
            laboratorio: formData.laboratorio.nome,
            observacoes: formData.observacoes,
          }
        : reg
    );

    setRegistros(updatedRegistros);

    setNotification({
      open: true,
      message: 'Registro atualizado com sucesso!',
    });
  };

  const deleteRegistro = (id: string) => {
    const updatedRegistros = registros.filter((r) => r.codigo !== id);
    setRegistros(updatedRegistros);

    setNotification({
      open: true,
      message: 'Registro excluído com sucesso!',
    });
  };

  const findRegistroById = (id: string) => {
    return registros.find((r) => r.codigo === id);
  };

  return (
    <RegistrosContext.Provider
      value={{
        registros,
        filteredRegistros,
        searchTerm,
        currentPage,
        itemsPerPage,
        notification,
        observacoesDialog,
        propriedadesDialog,
        selectedId,
        showForm,
        editMode,
        currentRegistro,
        setSearchTerm,
        setCurrentPage,
        setItemsPerPage,
        setNotification,
        setObservacoesDialog,
        setPropriedadesDialog,
        setSelectedId,
        setShowForm,
        setEditMode,
        setCurrentRegistro,
        addRegistro,
        updateRegistro,
        deleteRegistro,
        findRegistroById,
      }}
    >
      {children}
    </RegistrosContext.Provider>
  );
}; 
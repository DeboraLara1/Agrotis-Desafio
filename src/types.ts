export interface Registro {
  id?: number;
  codigo: string;
  nome: string;
  dataInicial: string;
  dataFinal: string;
  propriedade?: string;
  propriedadesCount?: number;
  propriedadesLista?: Propriedade[];
  propriedades?: Propriedade[];
  laboratorio: string | Laboratorio;
  observacoes?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export interface Laboratorio {
  id: number;
  nome: string;
}

export interface Propriedade {
  id: number;
  nome: string;
  cnpj?: string;
}

export interface FormData {
  nome: string;
  dataInicial: string;
  dataFinal: string;
  propriedades: Propriedade[];
  laboratorio: Laboratorio;
  observacoes: string;
} 
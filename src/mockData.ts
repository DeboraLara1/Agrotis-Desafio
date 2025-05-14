import { Registro } from './types';

export const mockRegistros: Registro[] = [
  {
    codigo: '9999',
    nome: 'Manoel da Silva Ribeiro',
    dataInicial: '2023-12-14T00:00:00Z',
    dataFinal: '2023-12-14T00:00:00Z',
    propriedade: '',
    propriedadesCount: 2,
    observacoes: 'Observações do registro do Manoel da Silva Ribeiro.',
    propriedades: [
      { id: 1, nome: 'Fazenda Modelo 1', cnpj: '11.111.111/0001-11' },
      { id: 2, nome: 'Fazenda Modelo 2', cnpj: '22.222.222/0001-22' }
    ],
    laboratorio: {
      id: 3,
      nome: 'Laboratório Modelo 3'
    },
    propriedadesLista: [
      { id: 1, nome: 'Fazenda Modelo 1', cnpj: '11.111.111/0001-11' },
      { id: 2, nome: 'Fazenda Modelo 2', cnpj: '22.222.222/0001-22' }
    ]
  },
  {
    codigo: '9998',
    nome: 'Nome do cliente 2',
    dataInicial: '2023-12-14T00:00:00Z',
    dataFinal: '2023-12-14T00:00:00Z',
    propriedade: 'Fazenda Modelo 1',
    observacoes: 'Observações do cliente 2.',
    propriedades: [
      { id: 1, nome: 'Fazenda Modelo 1', cnpj: '11.111.111/0001-11' }
    ],
    laboratorio: {
      id: 1,
      nome: 'Laboratório Modelo 1'
    }
  },
  {
    codigo: '9997',
    nome: 'Nome do cliente 3',
    dataInicial: '2023-12-14T00:00:00Z',
    dataFinal: '2023-12-14T00:00:00Z',
    propriedade: 'Fazenda Modelo 2',
    observacoes: 'Observações do cliente 3.',
    propriedades: [
      { id: 2, nome: 'Fazenda Modelo 2', cnpj: '22.222.222/0001-22' }
    ],
    laboratorio: {
      id: 2,
      nome: 'Laboratório Modelo 2'
    }
  },
  {
    codigo: '9996',
    nome: 'Nome do cliente 4',
    dataInicial: '2023-12-14T00:00:00Z',
    dataFinal: '2023-12-14T00:00:00Z',
    propriedade: 'Fazenda Modelo 3',
    observacoes: 'Observações do cliente 4.',
    propriedades: [
      { id: 3, nome: 'Fazenda Modelo 3', cnpj: '33.333.333/0001-33' }
    ],
    laboratorio: {
      id: 3,
      nome: 'Laboratório Modelo 3'
    }
  },
  {
    codigo: '9995',
    nome: 'Nome do cliente 5',
    dataInicial: '2023-12-14T00:00:00Z',
    dataFinal: '2023-12-14T00:00:00Z',
    propriedade: 'Fazenda Modelo 4',
    observacoes: 'Observações do cliente 5.',
    propriedades: [
      { id: 4, nome: 'Fazenda Modelo 4', cnpj: '44.444.444/0001-44' }
    ],
    laboratorio: {
      id: 1,
      nome: 'Laboratório Modelo 1'
    }
  },
  {
    codigo: '9994',
    nome: 'Nome do cliente 6',
    dataInicial: '2023-12-14T00:00:00Z',
    dataFinal: '2023-12-14T00:00:00Z',
    propriedade: '',
    propriedadesCount: 2,
    observacoes: 'Observações do cliente 6.',
    propriedades: [
      { id: 3, nome: 'Fazenda Modelo 3', cnpj: '33.333.333/0001-33' },
      { id: 4, nome: 'Fazenda Modelo 4', cnpj: '44.444.444/0001-44' }
    ],
    laboratorio: {
      id: 2,
      nome: 'Laboratório Modelo 2'
    },
    propriedadesLista: [
      { id: 3, nome: 'Fazenda Modelo 3', cnpj: '33.333.333/0001-33' },
      { id: 4, nome: 'Fazenda Modelo 4', cnpj: '44.444.444/0001-44' }
    ]
  },
  {
    codigo: '9993',
    nome: 'Nome do cliente 7',
    dataInicial: '2023-12-14T00:00:00Z',
    dataFinal: '2023-12-14T00:00:00Z',
    propriedade: '',
    propriedadesCount: 2,
    observacoes: 'Observações do cliente 7.',
    propriedades: [
      { id: 5, nome: 'Fazenda Modelo 5', cnpj: '55.555.555/0001-55' },
      { id: 6, nome: 'Fazenda Modelo 6', cnpj: '66.666.666/0001-66' }
    ],
    laboratorio: {
      id: 3,
      nome: 'Laboratório Modelo 3'
    },
    propriedadesLista: [
      { id: 5, nome: 'Fazenda Modelo 5', cnpj: '55.555.555/0001-55' },
      { id: 6, nome: 'Fazenda Modelo 6', cnpj: '66.666.666/0001-66' }
    ]
  },
  {
    codigo: '9992',
    nome: 'Nome do cliente 8',
    dataInicial: '2023-12-14T00:00:00Z',
    dataFinal: '2023-12-14T00:00:00Z',
    propriedade: '',
    propriedadesCount: 2,
    observacoes: 'Observações do cliente 8.',
    propriedades: [
      { id: 7, nome: 'Fazenda Modelo 7', cnpj: '77.777.777/0001-77' },
      { id: 8, nome: 'Fazenda Modelo 8', cnpj: '88.888.888/0001-88' }
    ],
    laboratorio: {
      id: 4,
      nome: 'Laboratório Modelo 4'
    },
    propriedadesLista: [
      { id: 7, nome: 'Fazenda Modelo 7', cnpj: '77.777.777/0001-77' },
      { id: 8, nome: 'Fazenda Modelo 8', cnpj: '88.888.888/0001-88' }
    ]
  },
  {
    codigo: '9991',
    nome: 'Nome do cliente 9',
    dataInicial: '2023-12-14T00:00:00Z',
    dataFinal: '2023-12-14T00:00:00Z',
    propriedade: '',
    propriedadesCount: 2,
    observacoes: 'Observações do cliente 9.',
    propriedades: [
      { id: 9, nome: 'Fazenda Modelo 9', cnpj: '99.999.999/0001-99' },
      { id: 10, nome: 'Fazenda Modelo 10', cnpj: '10.101.010/0001-10' }
    ],
    laboratorio: {
      id: 5,
      nome: 'Laboratório Modelo 5'
    },
    propriedadesLista: [
      { id: 9, nome: 'Fazenda Modelo 9', cnpj: '99.999.999/0001-99' },
      { id: 10, nome: 'Fazenda Modelo 10', cnpj: '10.101.010/0001-10' }
    ]
  },
  {
    codigo: '9990',
    nome: 'Nome do cliente 109090',
    dataInicial: '2023-12-14T00:00:00Z',
    dataFinal: '2023-12-14T00:00:00Z',
    propriedade: '',
    propriedadesCount: 2,
    observacoes: 'Observações do cliente 10.',
    propriedades: [
      { id: 11, nome: 'Fazenda Modelo 11', cnpj: '11.111.111/0001-11' },
      { id: 12, nome: 'Fazenda Modelo 12', cnpj: '12.121.212/0001-12' }
    ],
    laboratorio: {
      id: 6,
      nome: 'Laboratório Modelo 6'
    },
    propriedadesLista: [
      { id: 11, nome: 'Fazenda Modelo 11', cnpj: '11.111.111/0001-11' },
      { id: 12, nome: 'Fazenda Modelo 12', cnpj: '12.121.212/0001-12' }
    ]
  }
]; 
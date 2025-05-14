import { Registro, FormData, Laboratorio, Propriedade } from '../types';

const API_URL = 'http://localhost:3001';
const LABORATORIOS_URL = 'https://bitbucket.org/agrotis/teste-rh/raw/3bc797776e54586552d1c9666fd7c13366fc9548/teste-front-end-1/laboratorios.json';
const PROPRIEDADES_URL = 'https://bitbucket.org/agrotis/teste-rh/raw/3bc797776e54586552d1c9666fd7c13366fc9548/teste-front-end-1/propriedades.json';

const generateUniqueCode = (): string => {
  return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
};

export const registrosApi = {
  getAll: async (): Promise<Registro[]> => {
    try {
      console.log('Buscando registros da API:', `${API_URL}/registros`);
      const response = await fetch(`${API_URL}/registros`);
      if (!response.ok) {
        console.error('Resposta não ok:', response.status, response.statusText);
        throw new Error(`Falha ao buscar registros: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Registros recebidos:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Registro | null> => {
    try {
      console.log(`Buscando registro com ID ${id} da API:`, `${API_URL}/registros/${id}`);
      let response = await fetch(`${API_URL}/registros/${id}`);
      
      if (response.status === 404) {
        console.log(`Registro não encontrado pelo ID ${id}, tentando buscar pelo código`);
        const allResponse = await fetch(`${API_URL}/registros`);
        
        if (!allResponse.ok) {
          console.error('Resposta não ok ao buscar todos os registros:', allResponse.status);
          throw new Error(`Falha ao buscar registros: ${allResponse.status}`);
        }
        
        const allRegistros = await allResponse.json();
        const registroByCode = allRegistros.find((reg: any) => reg.codigo === id);
        
        if (registroByCode) {
          console.log(`Registro com código ${id} encontrado:`, registroByCode);
          return registroByCode;
        }
        
        console.warn(`Registro ${id} não encontrado por código também`);
        return null;
      }
      
      if (!response.ok) {
        console.error('Resposta não ok:', response.status, response.statusText);
        throw new Error(`Falha ao buscar registro: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Registro ${id} recebido:`, data);
      return data;
    } catch (error) {
      console.error(`Erro ao buscar registro ${id}:`, error);
      throw error;
    }
  },

  create: async (formData: FormData): Promise<Registro> => {
    try {
      console.log('Criando novo registro com dados:', formData);
      
      if (!formData.nome) {
        throw new Error('Nome é obrigatório');
      }
      
      if (!formData.dataInicial) {
        throw new Error('Data inicial é obrigatória');
      }
      
      if (!formData.dataFinal) {
        throw new Error('Data final é obrigatória');
      }
      
      if (!formData.propriedades || formData.propriedades.length === 0) {
        throw new Error('Pelo menos uma propriedade é obrigatória');
      }
      
      if (!formData.laboratorio) {
        throw new Error('Laboratório é obrigatório');
      }
      
      const simplifiedPropriedades = formData.propriedades.map(prop => ({
        id: prop.id,
        nome: prop.nome,
        cnpj: prop.cnpj || ""
      }));
      
      const simplifiedLaboratorio = {
        id: formData.laboratorio.id,
        nome: formData.laboratorio.nome
      };
      
      const uniqueCode = generateUniqueCode();
      
      const newRegistro: any = {
        id: Date.now(), 
        codigo: uniqueCode,
        nome: formData.nome,
        dataInicial: formData.dataInicial,
        dataFinal: formData.dataFinal,
        propriedade: formData.propriedades.length > 0 
          ? formData.propriedades[0].nome 
          : '',
        propriedadesCount: formData.propriedades.length > 1 
          ? formData.propriedades.length 
          : undefined,
        propriedades: simplifiedPropriedades,
        propriedadesLista: simplifiedPropriedades,
        laboratorio: simplifiedLaboratorio,
        observacoes: formData.observacoes || ""
      };
      
      console.log('Novo registro criado:', newRegistro);
      
      try {
        const testJson = JSON.stringify(newRegistro);
        console.log('Objeto pode ser serializado corretamente');
      } catch (jsonError) {
        console.error('Erro ao serializar objeto:', jsonError);
        throw new Error('Erro ao serializar objeto para JSON: ' + String(jsonError));
      }
      
      console.log('Enviando para API:', `${API_URL}/registros`);

      const response = await fetch(`${API_URL}/registros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRegistro),
      });

      if (!response.ok) {
        console.error('Erro na resposta ao criar registro:', response.status, response.statusText);
        try {
          const errorText = await response.text();
          console.error('Detalhes do erro:', errorText);
          throw new Error(`Falha ao criar registro: ${response.status} ${response.statusText} - ${errorText}`);
        } catch (textError) {
          throw new Error(`Falha ao criar registro: ${response.status} ${response.statusText}`);
        }
      }

      try {
        const savedRegistro = await response.json();
        console.log('Registro salvo com sucesso:', savedRegistro);
        return savedRegistro;
      } catch (jsonError) {
        console.error('Erro ao processar resposta JSON:', jsonError);
        console.log('Retornando objeto original como fallback');
        return newRegistro;
      }
    } catch (error) {
      console.error('Erro ao criar registro:', error);
      throw error;
    }
  },

  update: async (id: string, formData: FormData): Promise<Registro> => {
    try {
      console.log(`Atualizando registro ${id} com dados:`, formData);
      
      if (!formData.nome) {
        throw new Error('Nome é obrigatório');
      }
      
      if (!formData.dataInicial) {
        throw new Error('Data inicial é obrigatória');
      }
      
      if (!formData.dataFinal) {
        throw new Error('Data final é obrigatória');
      }
      
      if (!formData.propriedades || formData.propriedades.length === 0) {
        throw new Error('Pelo menos uma propriedade é obrigatória');
      }
      
      if (!formData.laboratorio) {
        throw new Error('Laboratório é obrigatório');
      }
      
      const simplifiedPropriedades = formData.propriedades.map(prop => ({
        id: prop.id,
        nome: prop.nome,
        cnpj: prop.cnpj || ""
      }));
      
      const simplifiedLaboratorio = {
        id: formData.laboratorio.id,
        nome: formData.laboratorio.nome
      };
      
      console.log(`Buscando registro existente ${id}`);
      const existingRegistro = await registrosApi.getById(id);
      
      let updatedRegistro: any;
      
      if (!existingRegistro) {
        console.log(`Registro com ID ${id} não encontrado. Criando um novo registro com este ID.`);
        
        updatedRegistro = {
          id: Date.now(), 
          codigo: id,
          nome: formData.nome,
          dataInicial: formData.dataInicial,
          dataFinal: formData.dataFinal,
          propriedade: formData.propriedades.length > 0 
            ? formData.propriedades[0].nome 
            : '',
          propriedadesCount: formData.propriedades.length > 1 
            ? formData.propriedades.length 
            : undefined,
          propriedades: simplifiedPropriedades,
          propriedadesLista: simplifiedPropriedades,
          laboratorio: simplifiedLaboratorio,
          observacoes: formData.observacoes || ""
        };
      } else {
        updatedRegistro = {
          ...existingRegistro,
          nome: formData.nome,
          dataInicial: formData.dataInicial,
          dataFinal: formData.dataFinal,
          propriedade: formData.propriedades.length > 0 
            ? formData.propriedades[0].nome 
            : '',
          propriedadesCount: formData.propriedades.length > 1 
            ? formData.propriedades.length 
            : undefined,
          propriedades: simplifiedPropriedades,
          propriedadesLista: simplifiedPropriedades,
          laboratorio: simplifiedLaboratorio,
          observacoes: formData.observacoes || ""
        };
        
        if (!updatedRegistro.id) {
          updatedRegistro.id = Date.now();
        }
      }
      
      console.log('Registro preparado para envio:', updatedRegistro);
      
      try {
        const testJson = JSON.stringify(updatedRegistro);
        console.log('Objeto pode ser serializado corretamente');
      } catch (jsonError) {
        console.error('Erro ao serializar objeto:', jsonError);
        throw new Error('Erro ao serializar objeto para JSON: ' + String(jsonError));
      }
      
      const method = existingRegistro ? 'PUT' : 'POST';
      const url = existingRegistro 
        ? `${API_URL}/registros/${existingRegistro.id}` 
        : `${API_URL}/registros`;
        
      console.log(`Enviando para API como ${method}:`, url);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRegistro),
      });

      if (!response.ok) {
        console.error('Erro na resposta ao processar registro:', response.status, response.statusText);
        try {
          const errorText = await response.text();
          console.error('Detalhes do erro:', errorText);
          throw new Error(`Falha ao processar registro: ${response.status} ${response.statusText} - ${errorText}`);
        } catch (textError) {
          throw new Error(`Falha ao processar registro: ${response.status} ${response.statusText}`);
        }
      }

      try {
        const savedRegistro = await response.json();
        console.log('Registro salvo com sucesso:', savedRegistro);
        return savedRegistro;
      } catch (jsonError) {
        console.error('Erro ao processar resposta JSON:', jsonError);
        console.log('Retornando objeto preparado como fallback');
        return updatedRegistro;
      }
    } catch (error) {
      console.error(`Erro ao atualizar registro ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      console.log(`Excluindo registro ${id}`);
      
      const existingRegistro = await registrosApi.getById(id);
      if (!existingRegistro) {
        console.warn(`Registro com ID ${id} não encontrado para exclusão`);
        return;
      }
      
      const apiId = existingRegistro.id;
      if (!apiId) {
        throw new Error(`Registro com código ${id} não tem ID numérico`);
      }
      
      console.log(`Excluindo registro com ID ${apiId}`);
      const response = await fetch(`${API_URL}/registros/${apiId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error('Erro na resposta ao excluir registro:', response.status, response.statusText);
        throw new Error(`Falha ao excluir registro: ${response.status} ${response.statusText}`);
      }

      console.log(`Registro ${id} excluído com sucesso`);
    } catch (error) {
      console.error(`Erro ao excluir registro ${id}:`, error);
      throw error;
    }
  }
};

export const laboratoriosApi = {
  getAll: async (): Promise<Laboratorio[]> => {
    try {
      const response = await fetch(LABORATORIOS_URL);
      if (!response.ok) {
        throw new Error(`Falha ao buscar laboratórios: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar laboratórios:', error);
      throw error;
    }
  }
};

export const propriedadesApi = {
  getAll: async (): Promise<Propriedade[]> => {
    try {
      const response = await fetch(PROPRIEDADES_URL);
      if (!response.ok) {
        throw new Error(`Falha ao buscar propriedades: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error);
      throw error;
    }
  }
};

export default {
  registros: registrosApi,
  laboratorios: laboratoriosApi,
  propriedades: propriedadesApi
}; 
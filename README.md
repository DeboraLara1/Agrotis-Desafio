# Todo React - Agrotis

Este é um aplicativo de gerenciamento de registros desenvolvido com React, TypeScript e Material UI.

## Requisitos

- Node.js (versão 14 ou superior)
- NPM (versão 6 ou superior)

## Tecnologias Utilizadas

- React 18
- TypeScript
- Material UI
- React Hook Form
- React Router
- Styled Components
- json-server (para simular uma API REST)

## Instalação

1. Clone o repositório
```
git clone https://github.com/DeboraLara1/Agrotis-Desafio.git

```

2. Instale as dependências
```
cd todo-react-agrotis
npm install
```

## Executando a Aplicação

Para executar a aplicação em modo de desenvolvimento com o servidor JSON:

```
npm run dev
```

Este comando inicia tanto o servidor de desenvolvimento React na porta 3000 quanto o json-server na porta 3001.

### Executando apenas o frontend

```
npm start
```

### Executando apenas o servidor JSON

```
npm run server
```

## Estrutura do Projeto

```
/src
  /assets        - Recursos estáticos como imagens
  /components    - Componentes reutilizáveis
  /context       - Contextos React para gerenciamento de estado
  /hooks         - Hooks personalizados
  /pages         - Componentes de página
  /services      - Serviços para comunicação com API
  /styles        - Estilos globais e tema
  App.tsx        - Componente principal da aplicação
  index.tsx      - Ponto de entrada da aplicação
```

## Funcionalidades

- Listagem de registros
- Criação de novos registros
- Edição de registros existentes
- Exclusão de registros
- Filtragem e paginação
- Visualização de detalhes

## API JSON Server

O projeto utiliza json-server para simular uma API REST. Os dados são armazenados no arquivo `db.json` na raiz do projeto.

### Rotas disponíveis:

- GET /registros - Lista todos os registros
- GET /registros/:id - Obtém um registro específico
- POST /registros - Cria um novo registro
- PUT /registros/:id - Atualiza um registro existente
- DELETE /registros/:id - Remove um registro

- GET /laboratorios - Lista todos os laboratórios
- GET /propriedades - Lista todas as propriedades

# Teste Front-End Agrotis

Uma aplicação React que implementa o layout solicitado para exibição de registros em uma tabela, seguindo o design do Figma.

## Funcionalidades

- Listagem de registros em tabela
- Paginação de dados
- Busca por texto
- Opções de visualização
- Notificação de sucesso
- Layout responsivo

## Tecnologias Utilizadas

- React 18
- TypeScript
- Material UI 
- Docker

## Como Executar Localmente

### Requisitos

- Node.js 16+ e npm
- ou Docker

### Opção 1: Execução com Node.js (Desenvolvimento)

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Execute a aplicação:
   ```
   npm start
   ```
4. Acesse `http://localhost:3000` no navegador

### Opção 2: Execução com Docker

1. Construa a imagem Docker:
   ```
   npm run docker:build
   ```
2. Execute o contêiner:
   ```
   npm run docker:run
   ```
   ou
   ```
   npm run docker:start
   ```
3. Acesse `http://localhost:8080` no navegador

### Comandos Disponíveis

- `npm start` - Inicia a aplicação em modo de desenvolvimento
- `npm run build` - Cria a versão de produção
- `npm run docker:build` - Constrói a imagem Docker
- `npm run docker:start` - Inicia o contêiner usando Docker Compose
- `npm run docker:stop` - Para o contêiner usando Docker Compose
- `npm run docker:run` - Inicia o contêiner usando Docker Run

## Estrutura do Projeto

```
src/
  ├── components/         # Componentes React
  │   ├── Header.tsx      # Cabeçalho com logo
  │   ├── TitleBar.tsx    # Barra de título verde
  │   ├── RegistroBar.tsx # Barra com contagem e botão
  │   ├── TabelaRegistros.tsx # Tabela de registros
  │   ├── Pagination.tsx  # Componente de paginação
  │   └── Notification.tsx # Notificações
  ├── mockData.ts         # Dados mockados para teste
  ├── types.ts            # Definições de tipos
  ├── App.tsx             # Componente principal
  └── index.tsx           # Ponto de entrada
```

## Layout do Figma

A aplicação implementa o design encontrado no Figma:
https://www.figma.com/proto/rBRn4y1bKSFbBooHCiqEgv/OUT---Front-end # Agrotis-Desafio

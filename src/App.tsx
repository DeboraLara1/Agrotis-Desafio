/** @jsxImportSource @emotion/react */
import React from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import RecordsPage from './pages/RecordsPage';
import CadastroPage from './pages/CadastroPage';
import Header from './components/Header';
import styledTheme from './styles/theme';

const muiTheme = createTheme({
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
  return (
    <StyledThemeProvider theme={styledTheme}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registros" element={<RecordsPage />} />
            <Route path="/cadastro" element={<CadastroPage />} />
            <Route path="/cadastro/:id" element={<CadastroPage />} />
            <Route path="/editar/:id" element={<Navigate to="/cadastro" replace />} />
          </Routes>
        </Router>
      </MuiThemeProvider>
    </StyledThemeProvider>
  );
}

export default App; 
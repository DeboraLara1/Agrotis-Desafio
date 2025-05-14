/** @jsxImportSource @emotion/react */
import React from 'react';
import { Box, Button, Typography, Card } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import LogoAgrotis from '../assets/images/Agrotis_logo.png';

const Logo = styled('img')(({ theme }) => ({
  height: 100,
  marginBottom: theme.spacing(6),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  width: '100%',
  maxWidth: 400,
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: 8,
  backgroundColor: '#fff',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  padding: theme.spacing(1.5, 4),
  marginTop: theme.spacing(4),
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

function Home() {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
      }}
    >
      <StyledCard>
        <Logo
          src={LogoAgrotis}
          alt="Agrotis Logo"
        />
        
        <Typography variant="h5" component="h1" align="center" fontWeight="500">
          VISUALIZAR
        </Typography>
        
        <Link to="/registros" style={{ textDecoration: 'none' }}>
          <StyledButton variant="contained" size="large">
            Acessar
          </StyledButton>
        </Link>
      </StyledCard>
    </Box>
  );
}

export default Home; 
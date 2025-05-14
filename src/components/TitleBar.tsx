import React from 'react';
import { Box, Typography, IconButton, Breadcrumbs, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StyledTitleBar = styled(Box)(({ theme }) => ({
  backgroundColor: '#00A884',
  color: 'white',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  color: 'white',
  marginRight: theme.spacing(1),
}));

interface TitleBarProps {
  title?: string;
  isEdit?: boolean;
  onBack?: () => void;
  showBreadcrumb?: boolean;
}

const TitleBar: React.FC<TitleBarProps> = ({ title, isEdit = false, onBack, showBreadcrumb = false }) => {
  if (title === "Registros") {
    return (
      <StyledTitleBar>
        <Typography 
          variant="h6" 
          component="div"
          sx={{ fontWeight: 500 }}
        >
          Teste Front-End
        </Typography>
      </StyledTitleBar>
    );
  }

  return (
    <StyledTitleBar>
      {onBack && (
        <BackButton aria-label="voltar" onClick={onBack}>
          <ArrowBackIcon />
        </BackButton>
      )}
      
      <Breadcrumbs 
        aria-label="breadcrumb" 
        separator=""
        sx={{ 
          color: 'white',
          '& .MuiBreadcrumbs-separator': {
            color: 'white',
            mx: 0.5
          }
        }}
      >
        <Link 
          component="span" 
          color="inherit" 
          sx={{ 
            cursor: 'pointer',
            textDecoration: 'none',
            fontWeight: 400,
            fontSize: '1rem'
          }}
          onClick={onBack}
        >
          Teste Front-End
        </Link>
        {showBreadcrumb && (
          <Typography 
            color="white" 
            sx={{ 
              fontWeight: 400,
              fontSize: '1rem'
            }}
          >
            {isEdit ? 'Editar Cadastro' : 'Novo Cadastro'}
          </Typography>
        )}
      </Breadcrumbs>
    </StyledTitleBar>
  );
};

export default TitleBar; 
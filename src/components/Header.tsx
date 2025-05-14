import React from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import LogoAgrotis from '../assets/images/Agrotis_logo_horizontal.png';

const Logo = styled('img')(({ theme }) => ({
  height: 24,
  marginRight: theme.spacing(2),
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#fff',
  boxShadow: 'none',
  borderBottom: '1px solid #e0e0e0',
}));

const Header: React.FC = () => {
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Box display="flex" justifyContent="center" width="100%" padding={1}>
          <Logo 
            src={LogoAgrotis} 
            alt="Agrotis Logo" 
          />
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header; 
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const RecordsLoading: React.FC = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '200px', 
        width: '100%' 
      }}
    >
      <CircularProgress size={50} color="primary" />
      <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
        Carregando registros...
      </Typography>
    </Box>
  );
};

export default RecordsLoading; 
import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography
} from '@mui/material';

interface ObservacoesDialogProps {
  open: boolean;
  onClose: () => void;
  observacoes: string;
}

const ObservacoesDialog: React.FC<ObservacoesDialogProps> = ({ open, onClose, observacoes }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle 
        sx={{ 
          backgroundColor: '#00A884', 
          color: 'white', 
          fontWeight: 'bold',
          padding: '16px 24px'
        }}
      >
        Observações
      </DialogTitle>
      <DialogContent sx={{ mt: 2, minHeight: '120px' }}>
        {observacoes ? (
          <Typography>{observacoes}</Typography>
        ) : (
          <Typography color="textSecondary">Aqui deve ser exibido o texto com as observações.</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '8px 24px 16px' }}>
        <Button 
          onClick={onClose} 
          variant="contained" 
          sx={{ 
            backgroundColor: '#00A884',
            '&:hover': {
              backgroundColor: '#019875',
            }
          }}
        >
          FECHAR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ObservacoesDialog; 
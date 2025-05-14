import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  List,
  ListItem,
  Typography
} from '@mui/material';
import { Propriedade } from '../types';

interface PropriedadesDialogProps {
  open: boolean;
  onClose: () => void;
  propriedades: Propriedade[];
  titulo: string;
}

const PropriedadesDialog: React.FC<PropriedadesDialogProps> = ({ 
  open, 
  onClose, 
  propriedades,
  titulo 
}) => {
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
        {titulo}
      </DialogTitle>
      <DialogContent sx={{ mt: 2, minHeight: '120px' }}>
        {propriedades && propriedades.length > 0 ? (
          <List>
            {propriedades.map((prop) => (
              <ListItem key={prop.id} sx={{ py: 1 }}>
                <Typography>
                  {prop.nome}{prop.cnpj ? ` - ${prop.cnpj}` : ''}
                </Typography>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="textSecondary">Nenhuma propriedade encontrada.</Typography>
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

export default PropriedadesDialog; 
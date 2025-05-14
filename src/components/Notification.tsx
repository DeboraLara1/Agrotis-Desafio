import React from 'react';
import { Snackbar, Alert, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface NotificationProps {
  open: boolean;
  message: string;
  onClose: () => void;
  severity?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  open,
  message,
  onClose,
  severity = 'success',
  duration = 5000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        icon={severity === 'success' ? <CheckCircleIcon /> : undefined}
        sx={{
          width: '100%',
          backgroundColor: severity === 'success' ? '#00A884' : undefined,
          borderRadius: '4px',
          '& .MuiAlert-icon': {
            color: '#fff'
          },
          '& .MuiAlert-message': {
            color: '#fff'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {message}
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default Notification; 
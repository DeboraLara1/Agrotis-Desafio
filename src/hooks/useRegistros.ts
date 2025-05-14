import { useContext } from 'react';
import { RegistrosContext } from '../context/RegistrosContext';

const useRegistros = () => {
  const context = useContext(RegistrosContext);
  
  if (!context) {
    throw new Error('useRegistros deve ser usado dentro de um RegistrosProvider');
  }
  
  return context;
};

export default useRegistros; 
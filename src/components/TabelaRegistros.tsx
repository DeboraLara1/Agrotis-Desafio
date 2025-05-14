import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Registro } from '../types';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: '1px solid #e0e0e0',
  padding: theme.spacing(1.5),
}));

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  color: theme.palette.text.primary,
  fontWeight: 'bold',
  borderBottom: '1px solid #e0e0e0',
  padding: theme.spacing(1.5),
}));

const ActionsCell = styled(StyledTableCell)({
  padding: '0 8px',
  width: '40px',
  textAlign: 'center',
});

const PropriedadesLink = styled('a')(({ theme }) => ({
  color: '#00A884',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
  cursor: 'pointer',
}));

interface TabelaRegistrosProps {
  registros: Registro[];
  onViewDetails: (id: string) => void;
  onViewOptions: (id: string, event: React.MouseEvent<HTMLButtonElement>) => void;
  onViewObservacoes: (id: string) => void;
  onViewPropriedades: (id: string) => void;
}

const TabelaRegistros: React.FC<TabelaRegistrosProps> = ({ 
  registros, 
  onViewDetails, 
  onViewOptions,
  onViewObservacoes,
  onViewPropriedades
}) => {
  const getLabName = (lab: string | {id: number, nome: string}): string => {
    return typeof lab === 'string' ? lab : lab.nome;
  };
  
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableHeaderCell>Código</StyledTableHeaderCell>
            <StyledTableHeaderCell>Nome</StyledTableHeaderCell>
            <StyledTableHeaderCell>Data Inicial</StyledTableHeaderCell>
            <StyledTableHeaderCell>Data Final</StyledTableHeaderCell>
            <StyledTableHeaderCell>Propriedade(s)</StyledTableHeaderCell>
            <StyledTableHeaderCell>Laboratório</StyledTableHeaderCell>
            <StyledTableHeaderCell>Obs.</StyledTableHeaderCell>
            <StyledTableHeaderCell width="60px"></StyledTableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {registros.map((registro) => (
            <TableRow key={registro.codigo}>
              <StyledTableCell>{registro.codigo}</StyledTableCell>
              <StyledTableCell>{registro.nome}</StyledTableCell>
              <StyledTableCell>{registro.dataInicial}</StyledTableCell>
              <StyledTableCell>{registro.dataFinal}</StyledTableCell>
              <StyledTableCell>
                {registro.propriedadesCount ? (
                  <PropriedadesLink onClick={() => onViewPropriedades(registro.codigo)}>
                    ({registro.propriedadesCount}) propriedades
                  </PropriedadesLink>
                ) : (
                  registro.propriedade
                )}
              </StyledTableCell>
              <StyledTableCell>{getLabName(registro.laboratorio)}</StyledTableCell>
              <ActionsCell>
                <IconButton 
                  size="small" 
                  onClick={() => onViewObservacoes(registro.codigo)}
                  disabled={!registro.observacoes}
                >
                  <ChatBubbleOutlineIcon 
                    fontSize="small" 
                    color={registro.observacoes ? "primary" : "disabled"} 
                  />
                </IconButton>
              </ActionsCell>
              <ActionsCell>
                <Tooltip title="Opções" placement="left">
                  <IconButton 
                    size="small" 
                    onClick={(event) => onViewOptions(registro.codigo, event)}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ActionsCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TabelaRegistros; 
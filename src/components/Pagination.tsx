import React from 'react';
import { Box, Typography, Select, MenuItem, IconButton, SelectChangeEvent } from '@mui/material';
import { styled } from '@mui/material/styles';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { PaginationProps } from '../types';

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 16px',
  borderTop: '1px solid #e0e0e0',
  backgroundColor: '#FFFFFF',
}));

const PaginationItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: theme.spacing(2),
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  minWidth: 55,
  height: 32,
  marginLeft: theme.spacing(1),
  '& .MuiSelect-select': {
    padding: '4px 8px',
    paddingRight: '24px',
    fontSize: '14px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e0e0e0',
  },
}));

const TextLabel = styled(Typography)(({ theme }) => ({
  color: '#666666',
  fontSize: '13px',
  whiteSpace: 'nowrap',
}));

const PaginationNavigation = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginLeft: '16px',
});

const StyledIconButton = styled(IconButton)({
  padding: '4px',
  color: '#666666',
  '&.Mui-disabled': {
    color: '#cccccc',
  },
});

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const handleItemsPerPageChange = (event: SelectChangeEvent<unknown>) => {
    onItemsPerPageChange(Number(event.target.value));
  };

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(start + itemsPerPage - 1, totalItems);

  return (
    <PaginationContainer>
      <PaginationItem>
        <TextLabel>
          Registros por página:
        </TextLabel>
        <StyledSelect
          size="small"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 200 }
            }
          }}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </StyledSelect>
      </PaginationItem>

      <PaginationItem>
        <TextLabel>
          {start}-{end} de {totalItems}
        </TextLabel>
      </PaginationItem>

      <PaginationNavigation>
        <StyledIconButton 
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          size="small"
        >
          <KeyboardDoubleArrowLeftIcon fontSize="small" />
        </StyledIconButton>
        <StyledIconButton 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          size="small"
        >
          <KeyboardArrowLeftIcon fontSize="small" />
        </StyledIconButton>
        <StyledIconButton 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          size="small"
        >
          <KeyboardArrowRightIcon fontSize="small" />
        </StyledIconButton>
        <StyledIconButton 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          size="small"
        >
          <KeyboardDoubleArrowRightIcon fontSize="small" />
        </StyledIconButton>
      </PaginationNavigation>
    </PaginationContainer>
  );
};

export default Pagination; 
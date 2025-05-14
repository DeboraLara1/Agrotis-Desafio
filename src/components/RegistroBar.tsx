import React, { useState } from 'react';
import { Typography, TextField, Button, IconButton, Divider, Collapse } from '@mui/material';
import styled from 'styled-components';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

const BarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid #e8e8e8;
  background-color: #FFFFFF;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const RegistrosTitle = styled(Typography)`
  color: #00A884;
  font-weight: 500;
  font-size: 14px;
`;

const StyledDivider = styled(Divider)`
  height: 24px;
  margin: 0 16px;
  width: 1.5px;
  background-color: #cccccc;
`;

const AddButton = styled(Button)`
  background-color: transparent;
  color: #00A884;
  font-weight: 500;
  font-size: 12px;
  padding: 4px 0;
  min-width: auto;
  text-transform: none;
  box-shadow: none;
  
  &:hover {
    background-color: transparent;
    opacity: 0.8;
  }

  .MuiSvgIcon-root {
    font-size: 16px;
    margin-right: 4px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 4px;
    height: 32px;
    font-size: 13px;
    background-color: #f9f9f9;
    
    .MuiOutlinedInput-notchedOutline {
      border-color: #e0e0e0;
    }
    
    &:hover .MuiOutlinedInput-notchedOutline {
      border-color: #d0d0d0;
    }
    
    .MuiInputAdornment-root {
      margin-right: -8px;
    }
  }
`;

interface RegistroBarProps {
  onSearch: (term: string) => void;
  onAddClick: () => void;
  totalRegistros?: number;
}

const RegistroBar: React.FC<RegistroBarProps> = ({ onSearch, onAddClick, totalRegistros }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleToggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch && searchText) {
      setSearchText('');
      onSearch('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch(value);
  };

  return (
    <BarContainer>
      <LeftSection>
        <RegistrosTitle>
          Registros ({totalRegistros || 0})
        </RegistrosTitle>
        <StyledDivider orientation="vertical" flexItem />
        <AddButton
          onClick={onAddClick}
          disableElevation
          disableRipple
          startIcon={<AddIcon />}
        >
          Adicionar
        </AddButton>
      </LeftSection>
      
      <SearchContainer>
        <Collapse in={showSearch} orientation="horizontal">
          <StyledTextField
            size="small"
            placeholder="Buscar"
            value={searchText}
            onChange={handleSearchChange}
            variant="outlined"
            autoFocus={showSearch}
          />
        </Collapse>
        <IconButton 
          onClick={handleToggleSearch}
          sx={{ 
            color: showSearch ? '#00A884' : '#9e9e9e',
            '&:hover': { backgroundColor: 'transparent' }
          }}
        >
          <SearchIcon fontSize="small" />
        </IconButton>
      </SearchContainer>
    </BarContainer>
  );
};

export default RegistroBar; 
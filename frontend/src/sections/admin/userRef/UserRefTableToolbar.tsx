import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, OutlinedInput, InputAdornment, FormControl, InputLabel, MenuItem, Stack } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// component
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

interface UserRefTableToolbarProps {
  filterName: string;
  onFilterName: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  filterStatus: number | "" | undefined;
  onFilterStatus: (event: SelectChangeEvent<number>) => void;
}

// -------------------------------------------------------------
interface SelectItemType {
  jenis: string;
  value: number;
  color: 'success'  | 'error';
}

const selectItem: SelectItemType[] = [
  {jenis:'Done', value:1, color:'success'},
  {jenis:'On progress', value:0, color:'error'},
]

// -------------------------------------------------------------------

export default function UserRefTableToolbar({filterName, onFilterName, onFilterStatus, filterStatus}: UserRefTableToolbarProps) {
  const [open, setOpen] = useState(false); // open dan close filter icon
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpen(prev => !prev);
  };


  return (
    <StyledRoot
      onClick={()=>{setOpen(false)}}
    >

      <StyledSearch
        value={filterName}
        onChange={onFilterName}
        placeholder="Search user..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
          </InputAdornment>
        }
      />

        <div>
        <Tooltip title="Filter status">
          <IconButton onClick={handleClick} sx={{zIndex:2}}>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      {open && (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-simple-select-label" sx={{typography:'body2'}}>Status</InputLabel>
            <Select 
              labelId="simple-select-label" 
              id="simple-select" 
              value={filterStatus} 
              sx={{width:'140px', typography:'body2'}} 
              label="status" 
              onChange={onFilterStatus}
              onClick={(event)=>{event.stopPropagation()}}
              >
                <MenuItem sx={{typography:'body2'}} onClick={(event)=>{event.stopPropagation()}} value={0}>All</MenuItem>
                {selectItem.map((item, index) => {
                  return(<MenuItem key={index} onClick={(event)=>{event.stopPropagation()}}sx={{typography:'body2', color:theme.palette[item.color].main}} value={item.value}>{item.jenis}</MenuItem>)
                })}
            </Select>
          </FormControl>
      )} 
        </div>
      

      
    </StyledRoot>
  );
}
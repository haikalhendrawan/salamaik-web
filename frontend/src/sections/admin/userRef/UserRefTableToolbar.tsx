import React, {useState, useEffect} from 'react';
// @mui
import { styled, alpha, useTheme } from '@mui/material/styles';
import { Toolbar, Tabs, Tab, OutlinedInput, InputAdornment, FormControl, InputLabel, MenuItem, Stack,} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// component
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 300,
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
  '& .MuiInputBase-input': {
    fontSize: 14,
  }
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width:240,
    },
  },
};

// ----------------------------------------------------------------------

interface UserRefTableToolbarProps {
  filterName: string;
  onFilterName: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  filterStatus: number | "" | undefined;
  onFilterStatus: (event: SelectChangeEvent<number>) => void;
}

// -------------------------------------------------------------
interface SelectItemType {
  unit: string;
  value: number;
}

const selectItem: SelectItemType[] = [
  {unit:'Kanwil DJPb Sumbar', value:7},
  {unit:'KPPN Padang', value:1},
  {unit:'KPPN Bukittinggi', value:2},
  {unit:'KPPN Solok', value:3},
  {unit:'KPPN Lubuk Sikaping', value:4},
  {unit:'KPPN Sijunjung', value:5},
  {unit:'KPPN Painan', value:6},
]

// -------------------------------------------------------------------

export default function UserRefTableToolbar({filterName, onFilterName, onFilterStatus, filterStatus}: UserRefTableToolbarProps) {
  const [open, setOpen] = useState(false); // open dan close filter icon

  const theme = useTheme();

  const filterUnit = useState(null);

  const [tabValue, setTabValue] = useState(0);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpen(prev => !prev);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: 0 | 1) => { // setiap tab komponen berubah
    setTabValue(newValue);
  };

  return (
    <>
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        sx={{
          "& button.Mui-selected": { color: theme.palette.text.primary },
          "& .MuiTabs-flexContainer": {height:'48px',width:'721px'},
          "& button.MuiTab-root": {minHeight: 30},
        }}
        TabIndicatorProps={{ sx: {bgcolor: theme.palette.text.primary}}}
      > 
        <Tab 
          icon={<Label sx={{color: theme.palette.text.primary, cursor:'pointer'}}>20</Label>} 
          label="All" 
          iconPosition="end"  
          value={0} 
        />
        <Tab 
          icon={<Label color={'success'} sx={{cursor:'pointer'}}>10</Label>} 
          label="Active" 
          iconPosition="end"  
          value={1} 
        />
        <Tab 
          icon={<Label color={'error'} sx={{cursor:'pointer'}}>5</Label>} 
          label="Inactive" 
          iconPosition="end"  
          value={2} 
        />
      </Tabs>


      <StyledRoot
        onClick={()=>{setOpen(false)}}
      >
        <Stack direction="row" spacing={2}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="unit-select-label" sx={{typography:'body2'}}>Unit</InputLabel>
            <Select 
              labelId="unit-select-label" 
              id="unit-select" 
              sx={{width:'200px', typography:'body2'}} 
              label="status" 
              onChange={onFilterStatus}
              onClick={(event)=>{event.stopPropagation()}}
              MenuProps={MenuProps}
              >
                <MenuItem sx={{typography:'body2', color:theme.palette.primary.main}} onClick={(event)=>{event.stopPropagation()}} value={0}>All Unit</MenuItem>
                {selectItem.map((item, index) => {
                  return(<MenuItem key={index} onClick={(event)=>{event.stopPropagation()}} sx={{typography:'body2'}} value={item.value}>{item.unit}</MenuItem>)
                })}
            </Select>
          </FormControl>

          <StyledSearch
            placeholder="Search user..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            }
          />

        </Stack>
        
      </StyledRoot>
    </>
  );
}


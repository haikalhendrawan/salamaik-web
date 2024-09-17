/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import React, {useState} from 'react';
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

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& button.Mui-selected': { 
    color: theme.palette.text.primary 
  },
  '& .MuiTabs-flexContainer': {
    minHeight:'48px',
    width:'721px'
  },
  '& button.MuiTab-root': {
    minHeight: 30
  },
  paddingLeft: 2,
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
  filterName: string,
  handleFilterName: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  filterUnit: string,
  handleFilterUnit: (e: SelectChangeEvent<unknown>) => void,
  tab: 0 | 1 | 2,
  setTab: React.Dispatch<React.SetStateAction<0 | 1 | 2>>,
  users: any[],
}

// -------------------------------------------------------------
interface SelectItemType {
  unit: string;
  value: string;
};

const selectItem: SelectItemType[] = [
  {unit:'Kanwil DJPb Sumbar', value:'03010'},
  {unit:'KPPN Padang', value: '010'},
  {unit:'KPPN Bukittinggi', value: '011'},
  {unit:'KPPN Solok', value: '090'},
  {unit:'KPPN Lubuk Sikaping', value: '091'},
  {unit:'KPPN Sijunjung', value: '077'},
  {unit:'KPPN Painan', value: '142'},
];

// -------------------------------------------------------------------

export default function UserRefTableToolbar({
  filterName, 
  handleFilterName,
  handleFilterUnit, 
  tab, 
  setTab,
  users}: UserRefTableToolbarProps) {
  const [_, setOpen] = useState(false); // open dan close filter icon

  const theme = useTheme();

  const handleTabChange = (_: React.SyntheticEvent, newValue: 0 | 1) => { // setiap tab komponen berubah
    setTab(newValue);
  };

  const countAll = users?.length || 0;

  const countActive = users?.filter(row => row.status === 1).length || 0;

  const countInactive = users?.filter(row => row.status === 0).length || 0;

  return (
    <>
      <StyledTabs
        value={tab} 
        onChange={handleTabChange} 
        TabIndicatorProps={{ sx: {bgcolor: theme.palette.text.primary}}}
      > 
        <Tab 
          icon={<Label sx={{color: theme.palette.text.primary, cursor:'pointer'}}>{countAll}</Label>} 
          label="All" 
          iconPosition="end"  
          value={2} 
        />
        <Tab 
          icon={<Label color={'success'} sx={{cursor:'pointer'}}>{countActive}</Label>} 
          label="Active" 
          iconPosition="end"  
          value={1} 
        />
        <Tab 
          icon={<Label color={'error'} sx={{cursor:'pointer'}}>{countInactive}</Label>} 
          label="Inactive" 
          iconPosition="end"  
          value={0} 
        />
      </StyledTabs>


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
              onClick={(event)=>{event.stopPropagation()}}
              onChange={handleFilterUnit}
              MenuProps={MenuProps}
              defaultValue={''}
              >
                <MenuItem 
                  sx={{typography:'body2', color:theme.palette.primary.main}} 
                  onClick={(event)=>{event.stopPropagation()}} 
                  value={''}
                >
                  All Unit
                </MenuItem>
                {selectItem.map((item, index) => {
                  return(<MenuItem 
                            key={index} 
                            onClick={(event)=>{event.stopPropagation()}} 
                            sx={{typography:'body2'}} 
                            value={item.value}
                          >
                            {item.unit}
                          </MenuItem>
                        )
                })}
            </Select>
          </FormControl>

          <StyledSearch
            placeholder="Search user..."
            value={filterName}
            onChange={handleFilterName}
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


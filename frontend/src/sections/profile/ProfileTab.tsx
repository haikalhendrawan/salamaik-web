import { useState } from 'react';
import Iconify from '../../components/iconify/Iconify';
// @mui
import { Box,Tabs, Tab} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useLoading from '../../hooks/display/useLoading';
// ------------------------------------------------
interface ProfileTabProps{
  tabValue:number,
  setTabValue:(newValue:0 | 1 | 2) => void
}

// --------------------------------------------------
export default function ProfileTab({tabValue, setTabValue}: ProfileTabProps){
  const theme = useTheme();

  const {setIsLoading} = useLoading();
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: 0 | 1) => { // setiap tab komponen berubah
    setTabValue(newValue);
  };
  
  return(
    <Box sx={{ width: '100%', height:'50px' }}>
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        sx={{
          "& button.Mui-selected": { color:theme.palette.text.primary },
          "& button.MuiTab-root": {height:5},
          height:60
        }}
        TabIndicatorProps={{ sx: {bgcolor: theme.palette.text.primary}}}
      > 
        <Tab 
          icon={<Iconify icon="solar:user-id-bold-duotone" />} 
          iconPosition="start" 
          label="General" 
          value={0}
          disableRipple
        />
        <Tab 
          icon={<Iconify icon="solar:key-bold-duotone" />} 
          iconPosition="start" 
          label="Security" 
          value={1} 
          disableRipple
        />
        <Tab 
          icon={<Iconify icon="solar:dumbbell-large-minimalistic-bold-duotone" />} 
          iconPosition="start" 
          label="Stats" 
          value={2} 
          disableRipple
          />
      </Tabs>
    </Box>
  )
}
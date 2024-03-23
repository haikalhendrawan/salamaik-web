import { useState } from 'react';
import Iconify from '../../components/iconify/Iconify';
// @mui
import { Box,Tabs, Tab} from '@mui/material';
import { useTheme } from '@mui/material/styles';
//sections



export default function ProfileTab(){
  const theme = useTheme();

  const [tabValue, setTabValue] = useState(0); // ganti menu komponen supervisi

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => { // setiap tab komponen berubah
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
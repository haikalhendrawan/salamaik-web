import Iconify from '../../../components/iconify';
// @mui
import { Stack, Typography, Tabs, Tab} from '@mui/material';
import {styled} from '@mui/material/styles';
import { useAuth } from '../../../hooks/useAuth';
// --------------------------------------------------------------
const StyledLabel = styled(Typography)(({theme}) => ({
  cursor: 'pointer',
  fontWeight: 700,
  lineHeight: 1.25,
  fontSize: '0.875rem',
  textTransform: 'capitalize',
  fontFamily: 'Public Sans,sans-serif',
  whiteSpace: 'normal',
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

interface SelectionTabProps{
  tab: string;
  changeTab: (event: React.SyntheticEvent, newValue: string) => void;
}
// --------------------------------------------------------------

export default function SelectionTab({tab, changeTab}: SelectionTabProps){
  const {auth} = useAuth();

  return(
    <Stack direction="row" alignItems="center" justifyContent="center " mb={5} sx={{display: auth?.kppn?.length === 5?'flex':'none'}}>
      <Tabs value={tab} onChange={changeTab}> 
        <Tab 
          icon={<Iconify icon="solar:city-bold-duotone" />} 
          label={    
                <StyledLabel>
                  KPPN Padang
                </StyledLabel>
                } 
          value={'010'} 
        />
        <Tab 
          icon={<Iconify icon="icon-park-twotone:clock-tower" />} 
          label={    
                <StyledLabel>
                  KPPN Bukittinggi
                </StyledLabel>
                } 
          value={'011'} 
        />
        <Tab 
          icon={<Iconify icon="ph:plant-duotone" />} 
          label={    
                <StyledLabel>
                  KPPN Solok
                </StyledLabel>
                } 
          value={'090'} 
        />
        <Tab 
          icon={<Iconify icon="material-symbols:landscape-2" />} 
          label={    
                <StyledLabel>
                  KPPN Lubuk Sikaping
                </StyledLabel>
                } 
          value={'091'} 
        />
        <Tab 
          icon={<Iconify icon="mdi:gold" />} 
          label={    
                <StyledLabel>
                  KPPN Sijunjung
                </StyledLabel>
                } 
          value={'077'} 
        />
        <Tab 
          icon={<Iconify icon="streamline:beach-solid" />} 
          label={    
                <StyledLabel>
                  KPPN Painan
                </StyledLabel>
                } 
          value={'142'} 
        />
        
      </Tabs>
    </Stack>
  )
}
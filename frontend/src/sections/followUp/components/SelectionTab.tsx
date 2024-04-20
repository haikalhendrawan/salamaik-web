import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Iconify from '../../../components/iconify';
// @mui
import { Container, Stack, Typography, Tabs, Tab, Grid, Paper, 
        IconButton, Breadcrumbs, Link} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
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
  tab: number;
  changeTab: (event: React.SyntheticEvent, newValue: number) => void;
}
// --------------------------------------------------------------

export default function SelectionTab({tab, changeTab}: SelectionTabProps){

  return(
    <Stack direction="row" alignItems="center" justifyContent="center " mb={5} >
      <Tabs value={tab} onChange={changeTab}> 
        <Tab 
          icon={<Iconify icon="solar:city-bold-duotone" />} 
          label={    
                <StyledLabel>
                  KPPN Padang
                </StyledLabel>
                } 
          value={0} 
        />
        <Tab 
          icon={<Iconify icon="icon-park-twotone:clock-tower" />} 
          label={    
                <StyledLabel>
                  KPPN Bukittinggi
                </StyledLabel>
                } 
          value={1} 
        />
        <Tab 
          icon={<Iconify icon="ph:plant-duotone" />} 
          label={    
                <StyledLabel>
                  KPPN Solok
                </StyledLabel>
                } 
          value={2} 
        />
        <Tab 
          icon={<Iconify icon="material-symbols:landscape-2" />} 
          label={    
                <StyledLabel>
                  KPPN Lubuk Sikaping
                </StyledLabel>
                } 
          value={3} 
        />
        <Tab 
          icon={<Iconify icon="mdi:gold" />} 
          label={    
                <StyledLabel>
                  KPPN Sijunjung
                </StyledLabel>
                } 
          value={4} 
        />
        <Tab 
          icon={<Iconify icon="streamline:beach-solid" />} 
          label={    
                <StyledLabel>
                  KPPN Painan
                </StyledLabel>
                } 
          value={5} 
        />
        
      </Tabs>
    </Stack>
  )
}
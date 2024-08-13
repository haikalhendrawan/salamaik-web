import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack, LinearProgress } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/display/useResponsive';
import {useAuth} from "../../../hooks/useAuth";
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
import NavSectionNested from '../../../components/nav-section/NavSectionNested';
//
import {navSupervisi, navHome, navMonitoring, navAdmin} from './config';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

interface NavType{
  openNav: boolean
  onCloseNav: any
};

export default function Nav({ openNav, onCloseNav }: NavType) {
  const { pathname } = useLocation();
  const {auth, setAuth} = useAuth() as AuthType;  

  const isDesktop = useResponsive('up', 'lg', 'md');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 0, display: 'inline-flex' }}> 
        <Logo /> {/* py 3 utk short logo*/}
      </Box>

      <NavSection data={navHome}  />
      <NavSection data={navSupervisi}  header={"SUPERVISI KPPN"} />
      <NavSection data={navMonitoring} header={"MONITORING"} />
      {auth?(<NavSectionNested data={navAdmin} header={"ADMIN"} />) :null}

      <Box sx={{ flexGrow: 1 }} />

    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
    {/* <LinearProgress sx={{position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 9999, }}/> */}
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'solid',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

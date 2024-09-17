/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

/**
 * sub menu drodown
 * ex: sub menu referensi di admin
 */

import {useEffect, useState} from "react"
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
// @mui
import { ListItemText} from '@mui/material';
import { useTheme } from '@mui/material/styles';
//
import { StyledNavItem, StyledSubNavItemIcon  } from './styles';

interface NavSubItem{
  item: {
    title: string,
    path: string,
    icon: any,
    info?: string,
  },
  open?: boolean
}

export default function NavSubItem({ item }:NavSubItem) {
  const { title, path, icon, info } = item;
  const theme = useTheme() as any;
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(location.pathname.includes(path));
  }, [location.pathname, path]);

  return (
    <StyledNavItem
      theme={theme}
      component={RouterLink}
      to={path}
      target={info}
      sx={
        theme.mode==='dark'?
        {
        '&.active': {
          color: theme.palette.common.white,
          fontWeight: 600,
         },
        }:
        {
        '&.active': {
          color: theme.palette.text.primary,
          fontWeight: 600,
         },
        }
      }
    >

      <StyledSubNavItemIcon theme={theme} sx={{ml:1}}>{isActive?icon:null}</StyledSubNavItemIcon>

      <ListItemText disableTypography primary={title}  />

    </StyledNavItem>
  );
}

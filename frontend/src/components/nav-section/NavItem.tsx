/**
 * customize masing-masing menu dalam sidebar
 * 
 */

import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import {ListItemText } from '@mui/material';
import { useTheme, alpha} from '@mui/material/styles';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';

interface Item{
  item: {
    title?: string,
    path?: string,
    icon?: any,
    target?: string,
  }
}

export default function NavItem({ item }:Item) {
  const { title, path, icon, target } = item;
  const theme = useTheme() as any;

  return (
    <StyledNavItem
      theme={theme}
      component={RouterLink}
      to={path}
      target={target}
      sx={
        theme.mode==='dark'?
        {
        '&.active': {
          color: theme.palette.primary.light,
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          fontWeight: 600,
         },
        }:
        {
        '&.active': {
          color: theme.palette.primary.main,
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          fontWeight: 600,
         },
        }
      }
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} />

    </StyledNavItem>
  );
}

/**
 * customize masing-masing menu dalam sidebar, gunain apabila menu perlu nested menu dropdown
 * 
 */

import {useState, useEffect, ReactNode} from "react";
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
// @mui
import {List, ListItemText,  Collapse} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
//
import { StyledNavItemIcon, StyledNavItemNested } from './styles';
import NavSubItem from "./NavSubItem";
import Iconify from "../iconify/Iconify";

interface NavItemNested{
  item: {
    title: string,
    path: string,
    icon: any,
    info?: string,
    menu: any,
  },
  onClick?: any,
  open?: any,
}

interface Item{
  title: string,
  path: string,
  icon: ReactNode,
}

export default function NavItemNested({ item, onClick, open}: NavItemNested) {
  const { title, path, icon, info, menu } = item;
  const theme = useTheme() as any;
  const location = useLocation();
  const [_, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(location.pathname.includes(path));
  }, [location.pathname, path]);
  
  return (
    <>
    <StyledNavItemNested
      theme={theme}
      component={RouterLink}
      to={path}
      target={info}
      onClick={(event:any) => {
          onClick(event);
          setIsActive(true);
        }}
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

      {open ? <Iconify icon={'solar:alt-arrow-up-linear'} sx={{mr:2}} />  : <Iconify icon={'solar:alt-arrow-down-linear'} sx={{mr:2}}/>}

    </StyledNavItemNested>

    {menu?.map((item:Item, index:number) => (
      <Collapse key={index} in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <NavSubItem  item={item} />
        </List>
      </Collapse>
    ))}
  </>
  );
}

// const icon = (name: any) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;
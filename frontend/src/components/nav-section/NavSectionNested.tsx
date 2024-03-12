import {useState} from "react";
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemText, ListSubheader, Button, Collapse, ListItemButton} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
//
import { StyledNavItem, StyledNavItemIcon, StyledNavItemNested} from './styles';
import NavItemNested from "./NavItemNested";
import Iconify from "../iconify/Iconify";
import SvgColor from "../svg-color/SvgColor";

// ----------------------------------------------------------------------

interface NavSectionNestedProp{
  data: any[]
  header?: string
}

export default function NavSectionNested({ data = [], ...other}: NavSectionNestedProp) {
  const [open, setOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(prev => !prev);
    event.preventDefault();
  };

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <Box {...other}>
      <List 
        disablePadding sx={{ p: 1 }}
        subheader={other.header?
        <ListSubheader component='a' sx={{fontSize: '12px', color:'rgb(99, 115, 129)', backgroundColor:'transparent'}}>
          {other.header}
        </ListSubheader>:null
        }
      >
        {data.map((item, index: number) => (
          <NavItemNested key={index} item={item} onClick={handleClick} open={open} close={handleClose}/>
        ))}

      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

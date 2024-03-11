import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemText, ListSubheader, Button} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';
import NavItem from "./NavItem";

// ----------------------------------------------------------------------
interface NavSectionProp{
  data: any[]
  header?: string
}
export default function NavSection({ data = [], ...other}:NavSectionProp) {
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
        {data.map((item, index) => (
          <NavItem key={index} item={item} />
        ))}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------


/**
 * gabungan menu dan header
 * ex: header Supervisi KPPN with multiple menu
 */
// @mui
import { Box, List, ListSubheader} from '@mui/material';
//
import NavItem from "./NavItem";

// ----------------------------------------------------------------------
interface NavSectionProp{
  data: any[]
  header?: string
};

export default function NavSection({ data = [], ...other}:NavSectionProp) {
  return (
    <Box {...other}>
      <List 
        disablePadding 
        sx={{ p: 1, px: 1.5}}
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


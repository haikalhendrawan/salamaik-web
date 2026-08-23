/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

/**
 * gabungan menu dan header
 * ex: header Supervisi KPPN with multiple menu
 */
import {useState} from "react";
// @mui
import { Box, List, ListSubheader} from '@mui/material';
//
import NavItem from "./NavItem";
import NavItemNested from './NavItemNested';

// ----------------------------------------------------------------------
interface NavSectionProp{
  data: any[]
  header?: string
};

interface OpenSection{
  [key: number]: boolean
};

//-----------------------------------------------------------------------------------------------------------------
export default function NavSection({ data = [], ...other}:NavSectionProp) {
    const [open, setOpen] = useState<OpenSection>({});

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [index]: !prevOpen[index],
    }));
    event.preventDefault();
  };


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
          item.menu 
            ? <NavItemNested 
                key={index} 
                item={item} 
                onClick={(e:React.MouseEvent<HTMLButtonElement>) => handleClick(e, index)} 
                open={open[index] ?? false}
              /> 
            : <NavItem key={index} item={item} />
        ))}
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------


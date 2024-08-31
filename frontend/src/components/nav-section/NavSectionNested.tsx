/**
 * gabungan menu dan header
 * ex: header Supervisi KPPN with dropdown
 */

import {useState} from "react";
// @mui
import { Box, List, ListSubheader} from '@mui/material';
//
import NavItemNested from "./NavItemNested";

// ----------------------------------------------------------------------

interface NavSectionNestedProp{
  data: any[]
  header?: string
};

interface OpenSection{
  [key: number]: boolean
};

// ----------------------------------------------------------------------
export default function NavSectionNested({ data = [], ...other}: NavSectionNestedProp) {
  const [open, setOpen] = useState<OpenSection>({});

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [index]: !prevOpen[index],
    }));
    event.preventDefault();
  };

  // const handleClose = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
  //   setOpen({
  //     ...open,
  //     [index]:false,
  //   });
  // }

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
          <NavItemNested 
            key={index} 
            item={item} 
            onClick={(e:React.MouseEvent<HTMLButtonElement>) => handleClick(e, index)} 
            open={open[index] ?? false} 
            // close={(e:React.MouseEvent<HTMLButtonElement>) => handleClose(e, index)}
          />
        ))}

      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useTheme} from "@mui/material/styles";
import {IconButton} from "@mui/material";
import Iconify from '../../../components/iconify';
import useMode from "../../../hooks/display/useMode";

// value dari useMode hook ada di ../theme/index.js
// ---------------------------------------------------

export default function ThemeSwitcher() {
  const theme = useTheme();

  const {setMode} = useMode() as ModeType;

  const handleClick = () => {
    setMode((prev: string) => prev==='dark'?'light':'dark') 
  };

  return(
  <div>
    <IconButton onClick={handleClick} size='large' sx={{mr:1}}>
        <Iconify icon={theme.mode==='light'?"solar:sun-2-bold-duotone":"tdesign:mode-dark"}sx={{color:'orange'}} />    
    </IconButton>
  </div>
  )
}

import {useState, useEffect, useContext} from "react";
import {styled} from "@mui/material/styles";
import {Switch, Button, IconButton, Badge, Chip, Fab} from "@mui/material";
import useMode, {ModeContext} from "../../../hooks/display/useMode";
import Iconify from '../../../components/iconify';

// value dari useMode hook ada di ../theme/index.js


// ---------------------------------------------------

const ThemeSwitcher = () => {
    const {mode, setMode} = useMode() as ModeType;
    const handleClick = () => {
        setMode((prev: string) => prev==='dark'?'light':'dark') 
        const currentMode = localStorage.getItem('mode');
        const newMode = currentMode === 'light' ? 'dark' : 'light';
        localStorage.setItem('mode', newMode);
    };

    return(
    <div>
    <IconButton onClick={handleClick} size='large' sx={{mr:1}}>
        <Iconify icon={localStorage.getItem('mode')==='light'?"solar:sun-2-bold-duotone":"tdesign:mode-dark"}sx={{color:'orange'}} />    
    </IconButton>
    </div>
    )
}

export default ThemeSwitcher;
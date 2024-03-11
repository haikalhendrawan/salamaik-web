import React, {useState} from "react";
import {useTheme} from "@mui/material/styles";
import {IconButton, Stack, Popper, Paper, Fade, ClickAwayListener} from "@mui/material";
import useMode, {ModeContext} from "../../../hooks/display/useMode";
import Iconify from '../../../components/iconify';
import {GREY, PRIMARY, SECONDARY, INFO, SUCCESS, WARNING, ERROR, GREEN, PURPLE, PINK} from '../../../theme/palette';

interface Color{
	[key: string]:string
}

const ColorSwitcher = () => {
	const {mode, setMode, primaryColor, setPrimaryColor} = useMode() as ModeType;
	const theme = useTheme();
	const [open, setOpen] = useState(false);
	const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement | null>(null);
	const currentColor = localStorage.getItem('color') || '';
	const bgColor =  currentColor? JSON.parse(currentColor)?.name : false;
	const handleClick= (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			setOpen(prev => !prev)
			setAnchorEl(event.currentTarget)
	};
	const handleColorClick = (color: Color) => {
			setPrimaryColor(color);
			localStorage.setItem('color', JSON.stringify(color))
		};

	const handleClose= () => {
			setOpen(false);
	};

			
	return(
	<div>
		<IconButton size='large' sx={{mr:1}} onClick={handleClick}>
			<Iconify icon={"mdi:palette"} />    
		</IconButton>
		<Popper open={open} anchorEl={anchorEl} placement={'bottom'} transition sx={{ zIndex: 1102}}>
			{({ TransitionProps }) => (
				<Fade {...TransitionProps} timeout={350}>
					<Paper sx={{boxShadow:"0px 5px 5px -3px rgba(145, 158, 171, 0.2), 0px 8px 10px 1px rgba(145, 158, 171, 0.14), 0px 3px 14px 2px rgba(145, 158, 171, 0.12)"}}>
					<ClickAwayListener onClickAway={handleClose}>
					<div>
							<Stack direction="row" spacing={2}>
									<IconButton onClick={() => handleColorClick(PRIMARY)}><Iconify icon={"carbon:dot-mark"} sx={{color:'#2065d1', borderRadius:'50%', backgroundColor: bgColor==='primary'?theme.palette.action.selected:null}} /></IconButton>
									<IconButton onClick={() => handleColorClick(GREEN)}><Iconify icon={"carbon:dot-mark"} sx={{color:'rgb(0, 167, 111)', borderRadius:'50%', backgroundColor: bgColor==='green'?theme.palette.action.selected:null}} /></IconButton>
									<IconButton onClick={() => handleColorClick(PURPLE)}><Iconify icon={"carbon:dot-mark"} sx={{color:'#9c27b0', borderRadius:'50%', backgroundColor: bgColor==='purple'?theme.palette.action.selected:null}} /></IconButton>
							</Stack>
							<Stack direction="row" spacing={2}>
									<IconButton onClick={() => handleColorClick(PINK)}><Iconify icon={"carbon:dot-mark"} sx={{color:PINK.main, borderRadius:'50%', backgroundColor: bgColor==='pink'?theme.palette.action.selected:null}} /></IconButton>
									<IconButton onClick={() => handleColorClick(WARNING)}><Iconify icon={"carbon:dot-mark"} sx={{color:WARNING.main, borderRadius:'50%', backgroundColor: bgColor==='warning'?theme.palette.action.selected:null}} /></IconButton>
									<IconButton onClick={() => handleColorClick(PRIMARY)}><Iconify icon={"bx:reset"}/></IconButton>
							</Stack>
					</div>
					</ClickAwayListener>
					</Paper>
				</Fade>
			)}
		</Popper>
		</div>
		)
}

export default ColorSwitcher;
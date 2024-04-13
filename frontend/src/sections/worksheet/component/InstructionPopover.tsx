import React, {useState} from "react";
import {useTheme} from "@mui/material/styles";
import {IconButton, Stack, Popper, Paper, Fade, Grow, ClickAwayListener, Backdrop, Box, Typography} from "@mui/material";
// ----------------------------------------------------------------------------------------
const style = {
  p: 2,
  mt: 1.5,
  ml: 0.75,
  width: 300,
  typography: 'body2',
  borderRadius: '8px',
  display:'flex',
  flexDirection:'column'
};

interface InstructionPopperProps{
  open: boolean,
  anchorEl: EventTarget & HTMLButtonElement | null,
  handleClose: () => void
};

// ---------------------------------------------------------------------------------------------
export default function InstructionPopover({open, anchorEl, handleClose}: InstructionPopperProps){
  const theme = useTheme();

  return(
    <>
    {/* <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={handleClose}
    > */}
      <Popper 
        open={open} anchorEl={anchorEl} placement={'top-start'} transition sx={{ zIndex: 9999 }}>
				{({ TransitionProps }) => (
					<Grow {...TransitionProps} timeout={200}>
						<Paper sx={{...style, boxShadow: theme.customShadows.dialog}}>
							<ClickAwayListener onClickAway={handleClose}>
                <Box>
                  <Stack direction='column' spacing={1}>
                    <Typography variant='body2' sx={{fontSize: 14}}  fontWeight={'bold'}>Instruksi</Typography>
                    <Typography variant='body2' sx={{fontSize: 12}}>Pada aplikasi OMSPAN, navigasi pada menu Pembayaran kemudian sesuaikan data dengan file yang tertera</Typography>
                    <Typography variant='body2' sx={{fontSize: 12}}>Buka menu yang tertulis pada petunjuk kemudian update sesuai ketentuan</Typography>
                  </Stack>
                </Box>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>
    {/* </Backdrop> */}
    </>
   
  )
}
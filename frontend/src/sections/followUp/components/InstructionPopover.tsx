/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useTheme} from "@mui/material/styles";
import { Stack, Popper, Paper, Grow, ClickAwayListener,  Box, Typography} from "@mui/material";
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
  handleClose: () => void,
  instruction: string | null,
  fileExample: string | null
};

// ---------------------------------------------------------------------------------------------
export default function InstructionPopover({open, anchorEl, handleClose, instruction, fileExample}: InstructionPopperProps){
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
                    <Typography variant='body2' sx={{fontSize: 14}} fontWeight={'bold'}>Instruksi</Typography>
                    <Typography variant='body2' sx={{fontSize: 12}}>{instruction}</Typography>
                  </Stack>
                  <br />
                  <Stack direction='column' spacing={1}>
                    <Typography variant='body2' sx={{fontSize: 14}} fontWeight={'bold'}>Dokumen</Typography>
                    <Typography variant='body2' sx={{fontSize: 12}}>{fileExample}</Typography>
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
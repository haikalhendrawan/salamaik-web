/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useTheme} from "@mui/material/styles";
import { Stack, Popper, Paper, Grow, ClickAwayListener,  Box, Typography} from "@mui/material";
import { WsJunctionType } from "../types";
//-----------------------------------------------------------------------------------------------------------------
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

interface LinkFilePopoverProps{
  open: boolean,
  anchorEl: EventTarget & HTMLButtonElement | null,
  handleClose: () => void,
  wsJunction: WsJunctionType | null,
}
//-----------------------------------------------------------------------------------------------------------------
export default function LinkFilePopover({open, anchorEl, handleClose, wsJunction}: LinkFilePopoverProps) {
  const theme = useTheme();

  return (
    <>
      <Popper 
        open={open} anchorEl={anchorEl} placement={'top-start'} transition sx={{ zIndex: 9999 }}>
				{({ TransitionProps }) => (
					<Grow {...TransitionProps} timeout={200}>
						<Paper sx={{...style, boxShadow: theme.customShadows.dialog}}>
							<ClickAwayListener onClickAway={handleClose}>
                <Box>
                  <Stack direction='column' spacing={1}>
                    
                  </Stack>
                  <br />
                  <Stack direction='column' spacing={1}>

                  </Stack>
                </Box>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>
    </>
  )
}

/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { useMemo,  useState, useEffect } from "react";
import {useTheme} from "@mui/material/styles";
import { Stack, Popper, Paper, Grow, ClickAwayListener, Box, FormControl, TextField, Typography} from "@mui/material";
import { WsJunctionType, WorksheetType } from "../types";
import styled from "@mui/material/styles/styled";
import { useAuth } from "../../../hooks/useAuth";
import useSocket from "../../../hooks/useSocket";
import useWsJunction from "../useWsJunction";
import useSnackbar from "../../../hooks/display/useSnackbar";
import useLoading from "../../../hooks/display/useLoading";
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
  wsDetail: WorksheetType | null,
}

const StyledFormControl = styled(FormControl)(({theme}) => ({
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(0.5),
  width: '100%',
  height: '100%',
}));
//-----------------------------------------------------------------------------------------------------------------
export default function LinkFilePopover({open, anchorEl, handleClose, wsJunction, wsDetail}: LinkFilePopoverProps) {
  const [linkFile, setLinkFile] = useState(wsJunction?.link_file || '');

  const theme = useTheme();

  const {auth} = useAuth();

  const {socket} = useSocket();

  const {getWsJunctionKanwil} = useWsJunction();

  const {openSnackbar} = useSnackbar();

  const {setIsLoading} = useLoading();

  const isPastDue = useMemo(() => new Date().getTime() > new Date(wsDetail?.close_period || "").getTime(), [wsDetail]);

  const isKanwil = useMemo(() =>{
    return auth?.kppn?.length === 5;
  }, [auth]);

  const handleEditLinkFile = () => {
    if(socket?.connected === false) {
      return openSnackbar("websocket failed, check your connection", "error");
    };

    socket?.emit("updateLinkFile", {
      worksheetId: wsJunction?.worksheet_id, 
      junctionId: wsJunction?.junction_id, 
      linkFile,
    },
    async(response: any) => {
      try{
        if (response?.success) {
          openSnackbar(response?.message || "Success", "success");
        } else {
          openSnackbar("Failed to update link file", "error");
        }

        setIsLoading(true);
        await getWsJunctionKanwil(wsJunction?.kppn_id || '');
        setIsLoading(false);
        // lastSavedNoteRef.current = currentNote;
      }catch(err:any){
        openSnackbar(err?.message, 'error');
        setIsLoading(false);
      }finally{
        setIsLoading(false);
      }

    });
  };

  useEffect(() => {
    setLinkFile(wsJunction?.link_file || '');
  }, [wsJunction]);

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
                    <Typography variant='body3' fontSize={12} textAlign={'left'}>Link Bukti Dukung</Typography>
                    <StyledFormControl>
                      <TextField 
                        size='small' 
                        value={linkFile}
                        onChange={(e) => setLinkFile(e.target.value)}
                        onBlur={() => handleEditLinkFile()} 
                        multiline 
                        minRows={6} 
                        maxRows={6}
                        fullWidth
                        inputProps={{sx: {fontSize: 12, width:'100%', height:'100%'}, spellCheck: false}} 
                        disabled={!isKanwil || isPastDue}
                      />
                    </StyledFormControl>
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

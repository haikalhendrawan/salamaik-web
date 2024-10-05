/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useEffect, useState} from "react";
import {useTheme, styled} from "@mui/material/styles";
import { Stack, Popper, Paper, Grow, ClickAwayListener, Box, Typography, Avatar, FormControl, CircularProgress} from "@mui/material";
import { useAuth } from "../../../hooks/useAuth";
import StyledTextField from "../../../components/styledTextField/StyledTextField";
import useAxiosJWT from "../../../hooks/useAxiosJWT";
import useSnackbar from "../../../hooks/display/useSnackbar";
import StyledButton from "../../../components/styledButton/StyledButton";
import Iconify from "../../../components/iconify/Iconify";
import { parseISO, format } from 'date-fns';
// ----------------------------------------------------------------------------------------
const style = {
  p: 2,
  mt: 1.5,
  ml: 0.75,
  width: 600,
  typography: 'body2',
  borderRadius: '8px',
  display:'flex',
  flexDirection:'column'
};

const StyledPaper = styled(Paper)(({theme}) => ({
  padding: theme.spacing(2),
  paddingTop: theme.spacing(1),
  background: theme.palette.grey[200],
  display:'flex',
  width: '100%',
  fontSize: '0.625rem',
}));

interface CommentType{
  id: number,
  ws_junction_id: number,
  user_id: string,
  comment: string,
  created_at: string,
  active: number,
  name: string,
  picture: string | null
};

interface CommentPopperProps{
  open: boolean,
  anchorEl: EventTarget & HTMLButtonElement | null,
  handleClose: () => void,
  wsJunctionId: number
};

// ---------------------------------------------------------------------------------------------
export default function CommentPopover({open, anchorEl, handleClose, wsJunctionId}: CommentPopperProps){
  const theme = useTheme();

  const axiosJWT = useAxiosJWT();

  const {openSnackbar} = useSnackbar();

  const [loading, setLoading] = useState<boolean>(true);

  const [comments, setComments] = useState<CommentType[] | []>([]);

  const getComments = async () => {
    try{
      const response = await axiosJWT.get(`/comment/getByWsJunctionId/${wsJunctionId}`);
      setComments(response.data.rows);
      console.log(wsJunctionId);
      setLoading(false);
    }catch(err: any){
      if(err.response){
        openSnackbar(err.response.data.message, "error");
      }else{
        openSnackbar(err.message, "error");
      }
    }
  }

  useEffect(() => {
    if(open){
      getComments();
    }else{
      setLoading(true);
    }
  }, [open]);

  return(
    <>
    {/* <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={handleClose}
    > */}
      <Popper 
        open={open} anchorEl={anchorEl} placement={'bottom-start'} transition sx={{ zIndex: 9999 }}>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={200}>
            <Paper sx={{...style, boxShadow: theme.customShadows.dialog}}>
              <ClickAwayListener onClickAway={handleClose}>
                <Box>
                <Stack direction="column" spacing={2}>
                  { loading
                    ? 
                      (
                        <Box sx={{display: 'flex'}}>
                          <CircularProgress />
                        </Box>
                      )
                    :
                      comments?.map((item, index) => (
                        <CommentItem comment={item} key={index+1} />
                      ))
                  }
                    <CommentItem newComment key={0} />
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
// ----------------------------------------------------------------------------------------
interface CommentItemProps{
  newComment?: boolean;
  comment?: CommentType;
};

function CommentItem({newComment=false, comment}: CommentItemProps){
  const {auth} = useAuth();
  if(newComment){
    return (
      <>
        <Stack direction="row" spacing={1} width={'100%'}>
          <Avatar src={`${import.meta.env.VITE_API_URL}/avatar/${auth?.picture}?${new Date().getTime()}` || ''} />
          <Stack direction="row" width={'100%'} spacing={1}>
            <FormControl size="small" fullWidth>
                <StyledTextField placeholder="Write new comment..." size="small" fontSize={12} multiline/>
            </FormControl>
            <StyledButton variant="contained" color="primary" size="small" sx={{width: '40px'}}>
              <Iconify icon="solar:plain-bold"/>
            </StyledButton>
          </Stack>
        </Stack>
      </>
    )
}

return (
  <>
    <Stack direction="row" spacing={1}>
      <Avatar src={`${import.meta.env.VITE_API_URL}/avatar/${comment?.picture}?${new Date().getTime()}` || ''} />
      <StyledPaper elevation={0} >
        <Stack direction="column" width={'100%'}>
          <Stack width={'100%'} direction="row" justifyContent={'space-between'}>
            <Typography variant="body2" fontWeight={'bold'}> {comment?.name} </Typography>
            <Typography variant="body3" fontSize={12}> {format(parseISO(comment?.created_at || ''), 'dd/MM/yyyy \n HH:mm')} </Typography>
          </Stack>
          <Typography variant="body2" fontSize={12}> {comment?.comment} </Typography>
        </Stack>
      </StyledPaper>
    </Stack>
  </>
)
}
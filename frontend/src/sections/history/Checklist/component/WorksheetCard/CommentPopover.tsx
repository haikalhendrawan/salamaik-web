/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useEffect, useState} from "react";
import {useTheme, styled} from "@mui/material/styles";
import { Stack, Popper, Paper, Grow, ClickAwayListener, Box, Typography, Avatar, FormControl, CircularProgress, Link} from "@mui/material";
import { useAuth } from "../../../../../hooks/useAuth";
import StyledTextField from "../../../../../components/styledTextField/StyledTextField";
import useAxiosJWT from "../../../../../hooks/useAxiosJWT";
import useSnackbar from "../../../../../hooks/display/useSnackbar";
import StyledButton from "../../../../../components/styledButton/StyledButton";
import Iconify from "../../../../../components/iconify/Iconify";
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
  background: theme.palette.background.neutral,
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

  const getComments = async() => {
    try{
      const response = await axiosJWT.get(`/comment/getByWsJunctionId/${wsJunctionId}`);
      setComments(response.data.rows);
      setLoading(false);
    }catch(err: any){
      if(err.response){
        openSnackbar(err.response.data.message, "error");
      }else{
        openSnackbar(err.message, "error");
      }
    }
  };

  const refreshComment = () => {
    getComments();
  };

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
                      comments?.length>0
                      ? comments?.map((item, index) => (
                          <CommentItem comment={item} key={index+1} refreshComment={refreshComment} wsJunctionId={wsJunctionId}/>
                        ))
                      : <Typography variant="body2" fontSize={12}>No comments available yet</Typography>
                  }
                    <CommentItem newComment key={0} refreshComment={refreshComment} wsJunctionId={wsJunctionId}/>
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
  refreshComment: () => void;
  wsJunctionId: number
};

function CommentItem({newComment=false, comment, refreshComment, wsJunctionId}: CommentItemProps){
  const {auth} = useAuth();

  const axiosJWT = useAxiosJWT();

  const isCreator = comment?.user_id === auth?.id;

  const {openSnackbar} = useSnackbar();

  const [commentBody, setCommentBody] = useState<string>('');

  const [disableAdd, setDisableAdd] = useState<boolean>(false);

  const handleDelete = async(id: number) => {
    try{
      await axiosJWT.post(`/comment/deleteById`, {id});
      refreshComment();
    }catch(err: any){
      if(err.response){
        openSnackbar(err.response.data.message, "error");
      }else{
        openSnackbar(err.message, "error");
      }
    }
  };

  const handleAdd = async() => {
    try{
      setDisableAdd(true);
      await axiosJWT.post(`/comment/add`, {
        wsJunctionId: wsJunctionId,
        commentBody: commentBody
      });
      refreshComment();
      setCommentBody('');
      setDisableAdd(false);
    }catch(err: any){
      setDisableAdd(false);
      if(err.response){
        openSnackbar(err.response.data.message, "error");
      }else{
        openSnackbar(err.message, "error");
      }
    }finally{
      setDisableAdd(false);
    }
  }

  if(newComment){
    return (
      <>
        <Stack direction="row" spacing={1} width={'100%'}>
          <Avatar src={`${import.meta.env.VITE_API_URL}/avatar/${auth?.picture}?${new Date().getTime()}` || ''} />
          <Stack direction="row" width={'100%'} spacing={1}>
            <FormControl size="small" fullWidth>
              <StyledTextField 
                placeholder="Write new comment..." 
                size="small" 
                fontSize={12} 
                multiline 
                value={commentBody} 
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCommentBody(e.target.value)} 
              />
            </FormControl>
            <StyledButton 
              variant="contained" 
              color="primary" 
              size="small" 
              sx={{width: '40px'}}
              onClick={handleAdd}
              disabled={disableAdd}
            >
              <Iconify icon="solar:plain-bold"/>
            </StyledButton>
          </Stack>
        </Stack>
      </>
    )
};

return (
  <>

      <Stack direction="row" spacing={1}>
        <Avatar src={`${import.meta.env.VITE_API_URL}/avatar/${comment?.picture}?${new Date().getTime()}` || ''} />
        <Stack direction="column" spacing={1} width={'100%'}>
          <StyledPaper elevation={0} >
            <Stack direction="column" width={'100%'}>
              <Stack width={'100%'} direction="row" justifyContent={'space-between'}>
                <Typography variant="body2" fontWeight={'bold'}> {comment?.name} </Typography>
                <Typography variant="body3" fontSize={12}> {format(parseISO(comment?.created_at || ''), 'dd/MM/yyyy \n HH:mm')} </Typography>
              </Stack>
              <Typography variant="body2" fontSize={12}> {comment?.comment} </Typography>
            </Stack>
          </StyledPaper>
          <Stack direction="row" width={'100%'} justifyContent={'end'} display={isCreator ? 'flex' : 'none'}>
            <Link 
              href='#' 
              fontSize={12} 
              width={'fit-content'} 
              textAlign={'right'} 
              marginRight={2}
              onClick={() => handleDelete(comment?.id || 0)}
            >
                Delete
            </Link>
          </Stack>
        </Stack>
    </Stack>
  </>
)
}
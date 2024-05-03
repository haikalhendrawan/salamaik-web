import { ReactNode, useState, createContext, useContext } from 'react';
// @mui
import { useTheme, alpha, styled } from '@mui/material/styles';
import { Typography, Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';
import StyledButton from '../../components/styledButton/StyledButton';
//------------------------------------------------------------------
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: '16px',
    maxHeight: 'calc(100% - 64px)',
    maxWidth: '444px',
    width: 'calc(100% - 64px)'
  },
  boxShadow: theme.customShadows.dialog,
  height: '100%'
}));

type DialogContextType = {
  openDialog: (title: string, 
              content: string, 
              color: 'success' |'pink' | 'white', 
              buttonTitle: string,
              action: () => void) => void,
  closeDialog: () => void
};

type DialogProviderProps = {
  children: ReactNode
};
//------------------------------------------------------------------
const DialogContext = createContext<DialogContextType>({openDialog: () => {}, closeDialog: () => {}});

const DialogProvider = ({children}: DialogProviderProps) => {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false);

  const [title, setTitle] = useState<string>('');

  const [buttonTitle, setButtonTitle] = useState<string>('');

  const [content, setContent] = useState<string>('');

  const [color, setColor] = useState<'success' |'pink' | 'white'>('white');

  const [handleClick, setHandleClick] = useState<() => void>(() => {});

  const openDialog = (title: string, 
                      content: string, 
                      color: 'success' |'pink' | 'white', 
                      buttonTitle: string,
                      action: () => void) => {
    setOpen(true);
    setTitle(title);
    setContent(content);
    setColor(color);
    setButtonTitle(buttonTitle);
    setHandleClick(() => action);
  };

  const closeDialog = () => {
    setOpen(false);
    setTitle('');
    setContent('');
    setColor('white');
    setButtonTitle('');
    setHandleClick(() => {});
  };

  const handleDeleteAction = () => {
    handleClick(); 
    closeDialog();
  };

  return(
    <DialogContext.Provider value={{openDialog, closeDialog}}>
      <StyledDialog
        open={open}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{typography:'h6', color: theme.palette.text.primary}}>
          {title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {content}
          </Typography>
        </DialogContent>
        <DialogActions sx={{p:3}}>
            <StyledButton 
              onClick={handleDeleteAction} 
              color={color} 
              variant='contained'
              sx={{width: '20%', borderRadius: '12px'}}
            >
              {buttonTitle}
            </StyledButton>
            <StyledButton 
              onClick={closeDialog} 
              color={'white'} 
              variant='contained'
              sx={{width: '20%', borderRadius: '12px'}}
            >
              Cancel
            </StyledButton>
        </DialogActions>
      </StyledDialog>
      {children}
    </DialogContext.Provider>
  )
};

const useDialog = (): DialogContextType => {
  return(useContext(DialogContext))
};

export default useDialog;
export {DialogProvider};
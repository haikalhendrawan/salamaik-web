/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { ReactNode, useState, createContext, useContext } from 'react';
// @mui
import { useTheme} from '@mui/material/styles';
import { Snackbar, Alert } from '@mui/material';
//------------------------------------------------------------------
type SnackbarContextType = {
  openSnackbar: (message: string, sever: 'success' | 'error' | 'white') => void,
};  
type SnackbarProviderProps = {
  children: ReactNode
};

//------------------------------------------------------------------
const SnackbarContext = createContext<SnackbarContextType>({openSnackbar: () => {}});

const SnackbarProvider = ({children}: SnackbarProviderProps) => {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false);

  const [severity, setSeverity] = useState<'success' | 'error'| 'white'>('white');

  const [message, setMessage] = useState('');

  const handleClose = ()=>{
    setOpen(false);
  };

  const openSnackbar = (message: string, sever: 'success' | 'error' | 'white') => {
    setMessage(message);
    setSeverity(sever)
    setOpen(true);
  }; 
  
  return(
    <SnackbarContext.Provider value={{openSnackbar}}>
      <Snackbar 
        open={open} 
        autoHideDuration={4000}
        onClose={handleClose} 
        anchorOrigin={{vertical:'top', horizontal:'right'}} 
        ClickAwayListenerProps={{ onClickAway: () => null }}
      >
        <Alert 
          variant="filled" 
          severity={severity==='success'
                    ?'success'
                    :'error'}
          sx={{ 
            width: '280px', 
            boxShadow: theme.customShadows.z1, 
            backgroundColor:theme.mode === 'dark'
                            ? theme.palette[severity].dark
                            : theme.palette[severity].dark,
            color:severity==='white'
                  ?theme.palette.common.black
                  :theme.palette.common.white
          }}
        >
          {message}
        </Alert>
      </Snackbar>

      {children}
    </SnackbarContext.Provider>
  )
};

const useSnackbar = (): SnackbarContextType => {
  return(useContext(SnackbarContext))
};

export default useSnackbar;
export {SnackbarProvider};
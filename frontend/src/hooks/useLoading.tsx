import { ReactNode, useState, createContext, useContext } from 'react';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import { Grid, Container, Typography, Backdrop } from '@mui/material';
import PuffLoader from 'react-spinners/PuffLoader';
//------------------------------------------------------------------
type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

type LoadingProviderProps = {
  children: ReactNode
}
//------------------------------------------------------------------
const LoadingContext = createContext<LoadingContextType>({isLoading:false, setIsLoading: () => {}});

const LoadingProvider = ({children}: LoadingProviderProps) => {
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);

  return(
    <LoadingContext.Provider value={{isLoading, setIsLoading}}>
      <Backdrop
        sx={{ color: '#F9FAFB', zIndex:9999, backgroundColor: alpha(theme.palette.grey[700], 0.6)}}
        open={isLoading}
      >
        <div style ={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <PuffLoader 
            color={theme.palette.primary.main}  
            style={{ justifyContent: 'center', alignItems: 'center' }} 
            speedMultiplier={0.7}
          />
        </div>
    </Backdrop>
      {children}
    </LoadingContext.Provider>
  )
};

const useLoading = (): LoadingContextType => {
  return(useContext(LoadingContext))
};

export default useLoading;
export {LoadingProvider};
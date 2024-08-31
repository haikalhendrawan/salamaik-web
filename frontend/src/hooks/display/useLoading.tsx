import { ReactNode, useState, createContext, useContext } from 'react';
// @mui
import { useTheme, alpha, styled } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import PuffLoader from 'react-spinners/PuffLoader';
//------------------------------------------------------------------
const StyledBackdrop = styled(Backdrop)(({theme}) => ({
  color: '#F9FAFB', 
  zIndex:9999, 
  backgroundColor: theme.mode==='dark'?alpha(theme.palette.grey[700], 0.6):alpha(theme.palette.grey[300], 0.6)
})); 

type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

type LoadingProviderProps = {
  children: ReactNode
};
//------------------------------------------------------------------
const LoadingContext = createContext<LoadingContextType>({isLoading: false, setIsLoading: () => {}});

const LoadingProvider = ({children}: LoadingProviderProps) => {
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);

  return(
    <LoadingContext.Provider value={{isLoading, setIsLoading}}>
      <StyledBackdrop open={isLoading}>
        <div style ={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <PuffLoader 
            color={theme.palette.primary.main}  
            style={{ justifyContent: 'center', alignItems: 'center' }} 
            speedMultiplier={0.7}
          />
        </div>
      </StyledBackdrop>
      {children}
    </LoadingContext.Provider>
  )
};

const useLoading = (): LoadingContextType => {
  return(useContext(LoadingContext))
};

export default useLoading;
export {LoadingProvider};
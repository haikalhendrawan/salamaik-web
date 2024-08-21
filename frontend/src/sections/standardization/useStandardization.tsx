import { ReactNode, useState, createContext, useContext} from 'react';
import useAxiosJWT from '../../hooks/useAxiosJWT';
import useLoading from '../../hooks/display/useLoading';
import useSnackbar from '../../hooks/display/useSnackbar';
import { StandardizationType } from './types';
//------------------------------------------------------------------
interface StandardizationContextType{
  standardization: StandardizationType[] | [],
  getStandardization: (kppnId: string) => Promise<void>,
};

type StandardizationProviderProps = {
  children: ReactNode
};

//------------------------------------------------------------------
const StandardizationContext = createContext<StandardizationContextType>({
  standardization: [], 
  getStandardization: async() => {},
});

const StandardizationProvider = ({children}: StandardizationProviderProps) => {
  const axiosJWT = useAxiosJWT();

  const { setIsLoading } = useLoading();

  const { openSnackbar } = useSnackbar();

  const [standardization, setStandardization] = useState<StandardizationType[] | []  >([]);

  const getStandardization = async(kppnId: string) => {
    try{
      setIsLoading(true);
      const time = new Date().getTime();
      const response = await axiosJWT.get(`/getStdWorksheet/${kppnId}?time=${time}`);
      setStandardization(response.data.rows);
      setIsLoading(false);
    }catch(err: any){
      setIsLoading(false);
      openSnackbar(err?.response?.data?.message, "error");
    }finally{
      setIsLoading(false);
    }
  };


  return(
    <StandardizationContext.Provider value={{standardization, getStandardization}}>
      {children}
    </StandardizationContext.Provider>
  )
};

const useStandardization = (): StandardizationContextType => {
  return(useContext(StandardizationContext))
};

export default useStandardization;
export {StandardizationProvider};
import { ReactNode, useState, createContext, useContext, useEffect } from 'react';
import useAxiosJWT from '../../hooks/useAxiosJWT';
import useLoading from '../../hooks/display/useLoading';
import useSnackbar from '../../hooks/display/useSnackbar';
import {useAuth}  from '../../hooks/useAuth';
//------------------------------------------------------------------
interface StandardizationType{
  id: number;
  title: string;
  cluster: number;
  interval: number;
  list:[
    StandardizationJunctionType[],
    StandardizationJunctionType[],
    StandardizationJunctionType[],
    StandardizationJunctionType[],
    StandardizationJunctionType[],
    StandardizationJunctionType[]
  ]
};

interface StandardizationJunctionType{
  id: number;
  kppn_id: number;
  period_id: number;
  standardization_id: number
  month: number;
  file: string;
  uploaded_at: string
};

interface StandardizationContextType{
  standardization: StandardizationType[] | [],
  getStandardization: () => Promise<void>,
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

  const {auth} = useAuth();

  const [standardization, setStandardization] = useState<StandardizationType[] | []  >([]);

  const getStandardization = async() => {
    try{
      setIsLoading(true);
      const time = new Date().getTime();
      const response = await axiosJWT.get(`/getStdWorksheet/${'010'}?time=${time}`);
      setStandardization(response.data.rows);
      setIsLoading(false);
    }catch(err: any){
      setIsLoading(false);
      openSnackbar(err.response.data.message, "error");
    }finally{
      setIsLoading(false);
    }
  };


  useEffect(() => {
    getStandardization();
  }, [])

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
/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { ReactNode, useState, createContext, useContext} from 'react';
import useAxiosJWT from '../../hooks/useAxiosJWT';
import useLoading from '../../hooks/display/useLoading';
import useSnackbar from '../../hooks/display/useSnackbar';
import { StandardizationType, StandardizationDasarType } from './types';
//------------------------------------------------------------------
interface StandardizationContextType{
  standardization: StandardizationType[] | [],
  getStandardization: (kppnId: string, dasarC?: string) => Promise<void>,
  dasar: StandardizationDasarType[] | [],
  selectedDasar: string | null,
  setSelectedDasar: (id: string) => void
};

type StandardizationProviderProps = {
  children: ReactNode
};

//------------------------------------------------------------------
const StandardizationContext = createContext<StandardizationContextType>({
  standardization: [], 
  getStandardization: async() => {},
  dasar: [],
  selectedDasar: "",
  setSelectedDasar: () => {}
});

const StandardizationProvider = ({children}: StandardizationProviderProps) => {
  const axiosJWT = useAxiosJWT();

  const { setIsLoading } = useLoading();

  const { openSnackbar } = useSnackbar();

  const [standardization, setStandardization] = useState<StandardizationType[] | []  >([]);

  const [dasar, setDasar] = useState<StandardizationDasarType[] | []  >([]);

  const [selectedDasar, setSelectedDasar] = useState<string | null>(null);

  const getStandardization = async(kppnId: string, dasarC?: string) => {
    try{
      setIsLoading(true);
      const time = new Date().getTime();
      const response = await axiosJWT.get(`/getStdWorksheet/${kppnId}?time=${time}&dasar=${dasarC ? dasarC : selectedDasar}`);
      setStandardization(response.data.rows.worksheet);
      setDasar(response.data.rows.dasar);
      if(!selectedDasar){
        setSelectedDasar(response.data.rows.dasar.find((item: StandardizationDasarType) => item.current === true)?.id || "");
      }
      setIsLoading(false);
    }catch(err: any){
      setIsLoading(false);
      openSnackbar(err?.response?.data?.message, "error");
    }finally{
      setIsLoading(false);
    }
  };


  return(
    <StandardizationContext.Provider value={{standardization, getStandardization, dasar, selectedDasar, setSelectedDasar}}>
      {children}
    </StandardizationContext.Provider>
  )
};

const useStandardization = (): StandardizationContextType => {
  return(useContext(StandardizationContext))
};

export default useStandardization;
export {StandardizationProvider};
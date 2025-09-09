/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { ReactNode, useState, createContext, useContext } from 'react';
import useAxiosJWT from '../../../hooks/useAxiosJWT';
// import useLoading from '../../hooks/display/useLoading';
import useSnackbar from '../../../hooks/display/useSnackbar';
import { WorksheetType, WsJunctionType } from './types';
import { useAuth } from '../../../hooks/useAuth';
//------------------------------------------------------------------
interface WsJunctionContextType{
  wsJunction: WsJunctionType[] | [],
  wsDetail: WorksheetType | null,
  setWsJunction: React.Dispatch<React.SetStateAction<[] | WsJunctionType[]>>, 
  getWsJunctionKanwil: (kppnId: string) => Promise<void>,
  getWsJunctionKPPN: () => Promise<void>,
  getWorksheet : (worksheetId: string) => Promise<void>,
};

type WsJunctionProviderProps = {
  children: ReactNode
};

//------------------------------------------------------------------
const WsJunctionContext = createContext<WsJunctionContextType>({
  wsJunction: [],
  wsDetail: null,
  setWsJunction: () => {}, 
  getWsJunctionKanwil: async() => {},
  getWsJunctionKPPN: async() => {},
  getWorksheet : async() => {}
});

const WsJunctionProvider = ({children}: WsJunctionProviderProps) => {
  const axiosJWT = useAxiosJWT();

  // const { setIsLoading } = useLoading();

  const { openSnackbar } = useSnackbar();

  const [wsJunction, setWsJunction] = useState<WsJunctionType[] | []  >([]);

  const [wsDetail, setWsDetail] = useState<WorksheetType | null>(null);

  const {auth} = useAuth();

  async function getWsJunctionKanwil(kppnId: string) {
    return auth?.kppn?.length===5?  getWsJunctionForKanwil(kppnId): getWsJunctionKPPN() ;
  };

  async function getWsJunctionForKanwil(kppnId: string) {
    try{
      // setIsLoading(true);
      const response = await axiosJWT.get(`/getWsJunctionByWorksheetForKanwil?kppn=${kppnId}&time=${new Date().getTime()}`);
      setWsJunction(response.data.rows);
      // setIsLoading(false);
    }catch(err: any){
      openSnackbar(err.response.data.message, "error");
      setWsJunction([]);
      // setIsLoading(false);
    }finally{
      // setIsLoading(false);
    }
  };

  async function getWsJunctionKPPN() {
    try{
      // setIsLoading(true);
      const response = await axiosJWT.get(`/getWsJunctionByWorksheetForKPPN?time=${new Date().getTime()}`);
      setWsJunction(response.data.rows);
      // setIsLoading(false);
    }catch(err: any){
      openSnackbar(err.response.data.message, "error");
      setWsJunction([]);
      // setIsLoading(false);
    }finally{
      // setIsLoading(false);
    }
  };

  async function getWorksheet(kppnId: string){
    try{
      const response = await axiosJWT.get(`/getWorksheetByPeriodAndKPPN/${kppnId}`);
      setWsDetail(response.data.rows);
    }catch(err: any){
      setWsDetail(null);
      if(err.response){
        openSnackbar(err.response.data.message, "error");
      }else{
        openSnackbar(err.message, "error");
      }
    }
  };

  return(
    <WsJunctionContext.Provider value={{wsJunction, wsDetail, getWorksheet, setWsJunction, getWsJunctionKanwil, getWsJunctionKPPN}}>
      {children}
    </WsJunctionContext.Provider>
  )
};

const useWsJunction = (): WsJunctionContextType => {
  return(useContext(WsJunctionContext))
};

export default useWsJunction;
export {WsJunctionProvider};
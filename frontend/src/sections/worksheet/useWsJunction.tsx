import { ReactNode, useState, createContext, useContext, useEffect } from 'react';
import useAxiosJWT from '../../hooks/useAxiosJWT';
import useLoading from '../../hooks/display/useLoading';
import useSnackbar from '../../hooks/display/useSnackbar';
import {useAuth}  from '../../hooks/useAuth';
import { WsJunctionType } from './types';
//------------------------------------------------------------------
interface WsJunctionContextType{
  wsJunction: WsJunctionType[] | [],
  getWsJunctionKanwil: (kppnId: string) => Promise<void>,
};

type WsJunctionProviderProps = {
  children: ReactNode
};

//------------------------------------------------------------------
const WsJunctionContext = createContext<WsJunctionContextType>({
  wsJunction: [], 
  getWsJunctionKanwil: async() => {},
});

const WsJunctionProvider = ({children}: WsJunctionProviderProps) => {
  const axiosJWT = useAxiosJWT();

  const { setIsLoading } = useLoading();

  const { openSnackbar } = useSnackbar();

  const {auth} = useAuth();

  const [wsJunction, setWsJunction] = useState<WsJunctionType[] | []  >([]);

  async function getWsJunctionKanwil(kppnId: string) {
    try{
      setIsLoading(true);
      const response = await axiosJWT.get(`/getWsJunctionByWorksheetForKanwil?kppn=${kppnId}`);
      setWsJunction(response.data.rows);
      console.log(response.data.rows)
      setIsLoading(false);
    }catch(err: any){
      openSnackbar(err.response.data.message, "error");
      setIsLoading(false);
    }finally{
      setIsLoading(false);
    }
  }


  return(
    <WsJunctionContext.Provider value={{wsJunction, getWsJunctionKanwil}}>
      {children}
    </WsJunctionContext.Provider>
  )
};

const useWsJunction = (): WsJunctionContextType => {
  return(useContext(WsJunctionContext))
};

export default useWsJunction;
export {WsJunctionProvider};
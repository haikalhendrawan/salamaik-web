import { ReactNode, useState, createContext, useContext } from 'react';
import useAxiosJWT from '../../hooks/useAxiosJWT';
// import useLoading from '../../hooks/display/useLoading';
import useSnackbar from '../../hooks/display/useSnackbar';
import { WsJunctionType } from './types';
//------------------------------------------------------------------
interface WsJunctionContextType{
  wsJunction: WsJunctionType[] | [],
  setWsJunction: React.Dispatch<React.SetStateAction<[] | WsJunctionType[]>>, 
  getWsJunctionKanwil: (kppnId: string) => Promise<void>,
  getWsJunctionKPPN: () => Promise<void>,
};

type WsJunctionProviderProps = {
  children: ReactNode
};

//------------------------------------------------------------------
const WsJunctionContext = createContext<WsJunctionContextType>({
  wsJunction: [],
  setWsJunction: () => {}, 
  getWsJunctionKanwil: async() => {},
  getWsJunctionKPPN: async() => {},
});

const WsJunctionProvider = ({children}: WsJunctionProviderProps) => {
  const axiosJWT = useAxiosJWT();

  // const { setIsLoading } = useLoading();

  const { openSnackbar } = useSnackbar();

  const [wsJunction, setWsJunction] = useState<WsJunctionType[] | []  >([]);

  async function getWsJunctionKanwil(kppnId: string) {
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


  return(
    <WsJunctionContext.Provider value={{wsJunction, setWsJunction, getWsJunctionKanwil, getWsJunctionKPPN}}>
      {children}
    </WsJunctionContext.Provider>
  )
};

const useWsJunction = (): WsJunctionContextType => {
  return(useContext(WsJunctionContext))
};

export default useWsJunction;
export {WsJunctionProvider};
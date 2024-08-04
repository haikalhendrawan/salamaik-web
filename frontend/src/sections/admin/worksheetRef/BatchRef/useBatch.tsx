import { ReactNode, useState, createContext, useContext, useEffect } from 'react';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useLoading from '../../../../hooks/display/useLoading';
import useSnackbar from '../../../../hooks/display/useSnackbar';
//------------------------------------------------------------------
export interface BatchType{ // di backend module worksheet ref
  id: string, 
  kppn_id: string,
  name: string, 
  alias: string,
  period: number,
  status: number,
  open_period: string,
  close_period: string,
  created_at: string,
  updated_at: string,
  matrix_status: number,
  open_follow_up: string,
  close_follow_up: string
};

interface BatchContextType{
  batch: BatchType[] | [],
  getBatch: () => Promise<void>
};

type BatchProviderProps = {
  children: ReactNode
};
//------------------------------------------------------------------
const BatchContext = createContext<BatchContextType>({batch: [], getBatch: () => new Promise (() => null)});

const BatchProvider = ({children}: BatchProviderProps) => {
  const axiosJWT = useAxiosJWT();

  const { setIsLoading } = useLoading();

  const { openSnackbar } = useSnackbar();

  const [batch, setBatch] = useState<BatchType[] | []  >([]);

  const getBatch = async() => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.get("/getAllWorksheet");
      setBatch(response.data.rows);
      setIsLoading(false);
    }catch(err: any){
      if(err.response){
        setIsLoading(false);
        openSnackbar(err.response.data.message, "error");
      }else{
        setIsLoading(false);
        openSnackbar(err.message, "error");
      }
    }finally{
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getBatch();
  }, [])

  return(
    <BatchContext.Provider value={{batch, getBatch}}>
      {children}
    </BatchContext.Provider>
  )
};

const useBatch = (): BatchContextType => {
  return(useContext(BatchContext))
};

export default useBatch;
export {BatchProvider};
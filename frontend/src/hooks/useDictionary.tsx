import { ReactNode, useState, createContext, useContext, useEffect } from 'react';
import useAxiosJWT from './useAxiosJWT';
import { useAuth } from './useAuth';
import useLoading from './display/useLoading';
import useSnackbar from './display/useSnackbar';
//------------------------------------------------------------------
interface DictionaryType{
  [key: string]: string | number
};

interface DictionaryContextType{
  statusRef: DictionaryType | null,
  periodRef: DictionaryType | null,
  kppnRef: DictionaryType[] | null,
  roleRef: DictionaryType | null,
};

type DictionaryProviderProps = {
  children: ReactNode
};

//------------------------------------------------------------------
const DictionaryContext = createContext<DictionaryContextType>({
  statusRef: null,
  periodRef: null,
  kppnRef: null,
  roleRef: null
});

const DictionaryProvider = ({children}: DictionaryProviderProps) => {
  const axiosJWT = useAxiosJWT();

  const { auth } = useAuth() as AuthType;

  const [roleRef, setRoleRef] = useState(null);

  const statusRef = {
    0: "Pending User",
    1: "Active User",
  };

  const [periodRef, setPeriodRef] = useState(null);

  const [kppnRef, setKPPNRef] = useState(null);

  const getPeriod = async() => {
    try{
      const response = await axiosJWT.get("/getAllPeriod");
      const obj: any = {};
      await response.data.rows.map((row: any) => {
        obj[row.id] = row.name;
      });
      setPeriodRef(obj);
      console.log(obj);
    }catch(err: any){
      console.log(err)
    }
  };

  const getKPPN= async() => {
    try{
      const response = await axiosJWT.get("/getAllUnit");
      setKPPNRef(response.data.rows);
    }catch(err: any){
      console.log(err)
    }
  };

  const getRole = async() => {
    try{
      const response = await axiosJWT.get("/getAllRole");
      const obj: any = {};
      await response.data.rows.map((row: any) => {
        obj[row.id] = row.title;
      });
      setRoleRef(obj);
      console.log(obj);
    }catch(err: any){
      console.log(err)
    }
  };

  useEffect(() => {
    const render = async() => {
      getPeriod();
      getKPPN();
      getRole();
    };
    
    auth?render():null
  }, [auth])

  return(
    <DictionaryContext.Provider value={{statusRef, periodRef, kppnRef, roleRef}}>
      {children}
    </DictionaryContext.Provider>
  )
};

const useDictionary = (): DictionaryContextType => {
  return(useContext(DictionaryContext))
};

export default useDictionary;
export {DictionaryProvider};
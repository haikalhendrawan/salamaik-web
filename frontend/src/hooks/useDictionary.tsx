import { ReactNode, useState, createContext, useContext, useEffect } from 'react';
import useAxiosJWT from './useAxiosJWT';
import { useAuth } from './useAuth';
import useLoading from './display/useLoading';
import useSnackbar from './display/useSnackbar';
//------------------------------------------------------------------
interface DictionaryType {
  [key: string | number]: string | number | any[];
  list: any[];
};

interface PeriodType{
  id: number,
  name: string,
  start: string,
  end: string,
  semester: number,
  tahun: string,
};

interface PeriodRefType{
  [key: string | number]: string | number | any[] | null;
  list: PeriodType[] | null ;
};

interface KomponenRefType{
  id: number,
  title: string,
  bobot: number,
  detail?: string,
  alias?: string,
};

interface SubKomponenRefType{
  id: number,
  komponen_id: number,
  title: string,
  detail?: string,
  alias?: string,
};

interface SubSubKomponenRefType{
  id: number,
  komponen_id: number,
  subkomponen_id: number,
  title: string,
  detail?: string,
  alias?: string,
};

interface DictionaryContextType{
  statusRef: DictionaryType | null,
  periodRef: PeriodRefType | null,
  kppnRef: DictionaryType | null,
  roleRef: DictionaryType | null,
  komponenRef: KomponenRefType[] | null,
  subKomponenRef: SubKomponenRefType[] | null,
  subSubKomponenRef: SubSubKomponenRefType[] | null,
};

type DictionaryProviderProps = {
  children: ReactNode
};

//------------------------------------------------------------------
const DictionaryContext = createContext<DictionaryContextType>({
  statusRef: null,
  periodRef: null,
  kppnRef: null,
  roleRef: null,
  komponenRef: null,
  subKomponenRef: null,
  subSubKomponenRef: null
});

const DictionaryProvider = ({children}: DictionaryProviderProps) => {
  const axiosJWT = useAxiosJWT();

  const { auth } = useAuth() as AuthType;

  const [roleRef, setRoleRef] = useState(null);

  const statusRef = {
    0: "Pending User",
    1: "Active User",
    list: [{0: "Pending User", 1: "Active User"}]
  };

  const [periodRef, setPeriodRef] = useState(null);

  const [kppnRef, setKPPNRef] = useState(null);

  const [komponenRef, setKomponenRef] = useState(null);

  const [subKomponenRef, setSubKomponenRef] = useState(null);

  const [subSubKomponenRef, setSubSubKomponenRef] = useState(null);

  const getPeriod = async() => {
    try{
      const response = await axiosJWT.get("/getAllPeriod");
      const obj: any = {};
      await response.data.rows.map((row: any) => {
        obj[row.id] = row.name;
      });
      obj.list = response.data.rows;
      setPeriodRef(obj);
    }catch(err: any){
      console.log(err);
    }
  };

  const getKPPN = async() => {
    try{
      const response = await axiosJWT.get("/getAllUnit");
      const obj: any = {};
      await response.data.rows.map((row: any) => {
        obj[row.id] = row.alias;
      });
      obj.list = response.data.rows;
      setKPPNRef(obj);
    }catch(err: any){
      console.log(err);
    }
  };

  const getRole = async() => {
    try{
      const response = await axiosJWT.get("/getAllRole");
      const obj: any = {};
      await response.data.rows.map((row: any) => {
        obj[row.id] = row.title;
      });
      obj.list = response.data.rows;
      setRoleRef(obj);
    }catch(err: any){
      console.log(err);
    }
  };

  const getKomponen = async() => {
    try{
      const response = await axiosJWT.get("/getAllKomponen");
      setKomponenRef(response.data.rows);
    }catch(err: any){
      console.log(err);
    }
  };

  const getSubKomponen = async() => {
    try{
      const response = await axiosJWT.get("/getAllSubKomponen");
      setSubKomponenRef(response.data.rows);
    }catch(err: any){
      console.log(err);
    }
  };

  const getSubSubKomponen = async() => {
    try{
      const response = await axiosJWT.get("/getAllSubSubKomponen");
      setSubSubKomponenRef(response.data.rows);
    }catch(err: any){
      console.log(err);
    }
  };

  useEffect(() => {
    const render = async() => {
      getPeriod();
      getKPPN();
      getRole();
      getKomponen();
      getSubKomponen();
      getSubSubKomponen();
    };
    
    auth?render():null
  }, [auth])

  return(
    <DictionaryContext.Provider value={{
      statusRef, 
      periodRef, 
      kppnRef, 
      roleRef, 
      komponenRef, 
      subKomponenRef,
      subSubKomponenRef
      }}>
      {children}
    </DictionaryContext.Provider>
  )
};

const useDictionary = (): DictionaryContextType => {
  return(useContext(DictionaryContext))
};

export default useDictionary;
export {DictionaryProvider};
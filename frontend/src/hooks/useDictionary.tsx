import { ReactNode, useState, createContext, useContext, useEffect } from 'react';
import useAxiosJWT from './useAxiosJWT';
import { useAuth } from './useAuth';
//------------------------------------------------------------------
interface DictionaryType {
  [key: string | number]: string | number | any[];
  list: any[];
};

interface PeriodType{
  id: number;
  name: string; 
  evenPeriod: 0;
  semester: number;
  tahun: number
};

interface PeriodRefType{
  [key: string | number]: string | number | any[] | null;
  list: PeriodType[] ;
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

interface UnitType{
  id: string;
  name: string;
  alias: string;
  kk_name: string;
  kk_nip: string;
  info: string;
  col_order: number;
  level: number;
};

interface UnitRefType{
  [key: string | number]: string | number | any[];
  list: UnitType[];
}

interface DictionaryContextType{
  statusRef: DictionaryType | null,
  periodRef: PeriodRefType | null,
  kppnRef: UnitRefType | null,
  roleRef: DictionaryType | null,
  komponenRef: KomponenRefType[] | null,
  subKomponenRef: SubKomponenRefType[] | null,
  subSubKomponenRef: SubSubKomponenRefType[] | null,
  getDictionary: () => void,
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
  subSubKomponenRef: null,
  getDictionary: () => {},
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

  const getDictionary = async() => {
    getPeriod();
    getKPPN();
    getRole();
    getKomponen();
    getSubKomponen();
    getSubSubKomponen();
  };

  useEffect(() => {
    auth?getDictionary():null
  }, [auth])

  return(
    <DictionaryContext.Provider value={{
      statusRef, 
      periodRef, 
      kppnRef, 
      roleRef, 
      komponenRef, 
      subKomponenRef,
      subSubKomponenRef,
      getDictionary
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
import { ReactNode, useState, createContext, useContext, useEffect } from 'react';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useLoading from '../../../../hooks/display/useLoading';
import useSnackbar from '../../../../hooks/display/useSnackbar';
//------------------------------------------------------------------
interface ChecklistType{
  id: number,
  title: string, 
  header: string | null,
  komponen_id: number,
  subkomponen_id: number | null,
  subsubkomponen_id: number | null,
  standardisasi: number | null, 
  matrix_title: string | null, 
  file1: string | null,
  file2: string | null,
  opsi: OpsiType[] | null,
  instruksi?: string | null,
  contoh_file?: string | null
};

interface OpsiType{
  id: number,
  title: string, 
  value: number,
  checklist_id: number
};


interface ChecklistContextType{
  checklist: ChecklistType[] | [],
  getChecklist: () => Promise<void>
};

type ChecklistProviderProps = {
  children: ReactNode
};
//------------------------------------------------------------------
const ChecklistContext = createContext<ChecklistContextType>({checklist: [], getChecklist: () => new Promise ((res, rej) => null)});

const ChecklistProvider = ({children}: ChecklistProviderProps) => {
  const axiosJWT = useAxiosJWT();

  const { setIsLoading } = useLoading();

  const { openSnackbar } = useSnackbar();

  const [checklist, setChecklist] = useState<ChecklistType[] | []  >([]);

  const [opsi, setOpsi] = useState<OpsiType[] | []  >([]);

  const getChecklist = async() => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.get("/getChecklistWithOpsi");
      setChecklist(response.data.rows);
      setIsLoading(false);
    }catch(err: any){
      setIsLoading(false);
      openSnackbar(err.response.data.message, "error");
    }finally{
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getChecklist();
  }, [])

  return(
    <ChecklistContext.Provider value={{checklist, getChecklist}}>
      {children}
    </ChecklistContext.Provider>
  )
};

const useChecklist = (): ChecklistContextType => {
  return(useContext(ChecklistContext))
};

export default useChecklist;
export {ChecklistProvider};
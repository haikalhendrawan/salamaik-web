import { ReactNode, useState, createContext, useContext} from 'react';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useLoading from '../../../../hooks/display/useLoading';
import useSnackbar from '../../../../hooks/display/useSnackbar';
//------------------------------------------------------------------
export interface ChecklistType{
  id: number,
  title: string | null, 
  header: string | null,
  komponen_id: number,
  subkomponen_id: number,
  subsubkomponen_id: number,
  standardisasi: number, 
  matrix_title: string | null, 
  file1: string | null,
  file2: string | null,
  opsi: OpsiType[] | null,
  instruksi: string | null,
  contoh_file: string | null
  peraturan: string | null,
  uic: string | null
};

export interface OpsiType{
  id: number,
  title: string, 
  value: number,
  checklist_id: number,
  positive_fallback: string,
  negative_fallback: string,
  rekomendasi: string
};

interface ChecklistContextType{
  checklist: ChecklistType[] | [],
  getChecklist: () => Promise<void>
};

type ChecklistProviderProps = {
  children: ReactNode
};
//------------------------------------------------------------------
const ChecklistContext = createContext<ChecklistContextType>({checklist: [], getChecklist: () => new Promise (() => null)});

const ChecklistProvider = ({children}: ChecklistProviderProps) => {
  const axiosJWT = useAxiosJWT();

  const { setIsLoading } = useLoading();

  const { openSnackbar } = useSnackbar();

  const [checklist, setChecklist] = useState<ChecklistType[] | []  >([]);

  const getChecklist = async() => {
    setIsLoading(true);
    try{
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
import { ReactNode, createContext, useContext, useState } from "react";
import { isAxiosError } from "axios";
import useAxiosJWT from "../../hooks/useAxiosJWT";
import { useAuth } from "../../hooks/useAuth";
import useSnackbar from "../../hooks/display/useSnackbar";
import { WorksheetType } from "../worksheet/types";
import { WsSPMLJunctionType } from "./types";
import useLoading from "../../hooks/display/useLoading";
//-----------------------------------------------------------------------------------------------------------------
interface WsSPMLJunctionContextType {
  wsSPMLJunction: WsSPMLJunctionType[];
  wsDetail: WorksheetType | null;
  setWsSPMLJunction: React.Dispatch<React.SetStateAction<WsSPMLJunctionType[]>>;
  getWsSPMLJunctionKanwil: (kppnId: string) => Promise<void>;
  getWsSPMLJunctionKPPN: () => Promise<void>;
  getWorksheet: (kppnId: string) => Promise<void>;
}

interface WsSPMLJunctionProviderProps {
  children: ReactNode;
}
//-----------------------------------------------------------------------------------------------------------------
const WsSPMLJunctionContext = createContext<WsSPMLJunctionContextType>({
  wsSPMLJunction: [],
  wsDetail: null,
  setWsSPMLJunction: () => {},
  getWsSPMLJunctionKanwil: async () => {},
  getWsSPMLJunctionKPPN: async () => {},
  getWorksheet: async () => {},
});

//-----------------------------------------------------------------------------------------------------------------
const WsSPMLJunctionProvider = ({ children }: WsSPMLJunctionProviderProps) => {
  const axiosJWT = useAxiosJWT();
  const { auth } = useAuth();
  const { openSnackbar } = useSnackbar();
  const [wsSPMLJunction, setWsSPMLJunction] = useState<WsSPMLJunctionType[]>([]);
  const [wsDetail, setWsDetail] = useState<WorksheetType | null>(null);
  const {setIsLoading} = useLoading();

  const showRequestError = (err: unknown) => {
    if (isAxiosError<{ message?: string }>(err)) {
      openSnackbar(err.response?.data?.message || err.message, "error");
      return;
    }

    openSnackbar(err instanceof Error ? err.message : "Unknown error", "error");
  };

  async function getWsSPMLJunctionForKanwil(kppnId: string) {
    setIsLoading(true);
    try {
      const response = await axiosJWT.get(
        `wsSPMLJunction/getWsSPMLJunctionByWorksheetForKanwil?kppn=${encodeURIComponent(kppnId)}&time=${Date.now()}`
      );
      setWsSPMLJunction(response.data.rows);
    } catch (err: unknown) {
      setWsSPMLJunction([]);
      showRequestError(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function getWsSPMLJunctionKPPN() {
    setIsLoading(true);
    try {
      const response = await axiosJWT.get(
        `wsSPMLJunction/getWsSPMLJunctionByWorksheetForKPPN?time=${Date.now()}`
      );
      setWsSPMLJunction(response.data.rows);
    } catch (err: unknown) {
      setWsSPMLJunction([]);
      showRequestError(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function getWsSPMLJunctionKanwil(kppnId: string) {
    if (auth?.kppn?.length === 5) {
      await getWsSPMLJunctionForKanwil(kppnId);
      return;
    }

    await getWsSPMLJunctionKPPN();
  }

  async function getWorksheet(kppnId: string) {
    setIsLoading(true);
    try {
      const response = await axiosJWT.get(`/getWorksheetByPeriodAndKPPN/${kppnId}`);
      setWsDetail(response.data.rows);
    } catch (err: unknown) {
      setWsDetail(null);
      showRequestError(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <WsSPMLJunctionContext.Provider
      value={{
        wsSPMLJunction,
        wsDetail,
        setWsSPMLJunction,
        getWsSPMLJunctionKanwil,
        getWsSPMLJunctionKPPN,
        getWorksheet,
      }}
    >
      {children}
    </WsSPMLJunctionContext.Provider>
  );
};

const useWsSPMLJunction = (): WsSPMLJunctionContextType =>
  useContext(WsSPMLJunctionContext);

// eslint-disable-next-line react-refresh/only-export-components
export default useWsSPMLJunction;
export { WsSPMLJunctionProvider };

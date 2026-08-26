import { ReactNode, createContext, useContext, useRef, useState } from "react";
import { isAxiosError } from "axios";
import useAxiosJWT from "../../hooks/useAxiosJWT";
import { useAuth } from "../../hooks/useAuth";
import useSnackbar from "../../hooks/display/useSnackbar";
import { WorksheetType } from "../worksheet/types";
import { SPMLScoreType, WsSPMLJunctionType } from "./types";
import useLoading from "../../hooks/display/useLoading";
//-----------------------------------------------------------------------------------------------------------------
interface WsSPMLJunctionContextType {
  wsSPMLJunction: WsSPMLJunctionType[];
  wsDetail: WorksheetType | null;
  spmlScore: SPMLScoreType | null;
  isScoreLoading: boolean;
  setWsSPMLJunction: React.Dispatch<React.SetStateAction<WsSPMLJunctionType[]>>;
  getWsSPMLJunctionKanwil: (kppnId: string) => Promise<void>;
  getWsSPMLJunctionKPPN: () => Promise<void>;
  getWorksheet: (kppnId: string) => Promise<void>;
  getSPMLScore: (worksheetSPMLId: string) => Promise<void>;
  resetSPMLScore: () => void;
}

interface WsSPMLJunctionProviderProps {
  children: ReactNode;
}
//-----------------------------------------------------------------------------------------------------------------
const WsSPMLJunctionContext = createContext<WsSPMLJunctionContextType>({
  wsSPMLJunction: [],
  wsDetail: null,
  spmlScore: null,
  isScoreLoading: false,
  setWsSPMLJunction: () => {},
  getWsSPMLJunctionKanwil: async () => {},
  getWsSPMLJunctionKPPN: async () => {},
  getWorksheet: async () => {},
  getSPMLScore: async () => {},
  resetSPMLScore: () => {},
});

//-----------------------------------------------------------------------------------------------------------------
const WsSPMLJunctionProvider = ({ children }: WsSPMLJunctionProviderProps) => {
  const axiosJWT = useAxiosJWT();
  const { auth } = useAuth();
  const { openSnackbar } = useSnackbar();
  const [wsSPMLJunction, setWsSPMLJunction] = useState<WsSPMLJunctionType[]>([]);
  const [wsDetail, setWsDetail] = useState<WorksheetType | null>(null);
  const [spmlScore, setSpmlScore] = useState<SPMLScoreType | null>(null);
  const [isScoreLoading, setIsScoreLoading] = useState(false);
  const scoreRequestId = useRef(0);
  const {setIsLoading} = useLoading();

  const showRequestError = (err: unknown) => {
    if (isAxiosError<{ message?: string }>(err)) {
      openSnackbar(err.response?.data?.message || err.message, "error");
      return;
    }

    openSnackbar(err instanceof Error ? err.message : "Unknown error", "error");
  };

  async function getSPMLScore(worksheetSPMLId: string) {
    if (!worksheetSPMLId) return;

    const requestId = ++scoreRequestId.current;
    setIsScoreLoading(true);
    try {
      const response = await axiosJWT.get(
        `/scoringEngine/spml/${encodeURIComponent(worksheetSPMLId)}`
      );
      if (requestId === scoreRequestId.current) {
        setSpmlScore(response.data.rows);
      }
    } catch (err: unknown) {
      if (requestId === scoreRequestId.current) {
        showRequestError(err);
      }
    } finally {
      if (requestId === scoreRequestId.current) {
        setIsScoreLoading(false);
      }
    }
  }

  function resetSPMLScore() {
    scoreRequestId.current += 1;
    setSpmlScore(null);
    setIsScoreLoading(false);
  }

  async function getWsSPMLJunctionForKanwil(kppnId: string) {
    setIsLoading(true);
    try {
      const response = await axiosJWT.get(
        `wsSPMLJunction/getWsSPMLJunctionByWorksheetForKanwil?kppn=${encodeURIComponent(kppnId)}&time=${Date.now()}`
      );
      const rows: WsSPMLJunctionType[] = response.data.rows;
      setWsSPMLJunction(rows);
      if (rows[0]?.worksheet_id) {
        await getSPMLScore(rows[0].worksheet_id);
      } else {
        setSpmlScore(null);
      }
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
      const rows: WsSPMLJunctionType[] = response.data.rows;
      setWsSPMLJunction(rows);
      if (rows[0]?.worksheet_id) {
        await getSPMLScore(rows[0].worksheet_id);
      } else {
        setSpmlScore(null);
      }
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
        spmlScore,
        isScoreLoading,
        setWsSPMLJunction,
        getWsSPMLJunctionKanwil,
        getWsSPMLJunctionKPPN,
        getWorksheet,
        getSPMLScore,
        resetSPMLScore,
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

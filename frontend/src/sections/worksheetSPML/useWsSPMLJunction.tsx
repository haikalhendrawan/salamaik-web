import { ReactNode, createContext, useContext, useRef, useState } from "react";
import { isAxiosError } from "axios";
import useAxiosJWT from "../../hooks/useAxiosJWT";
import { useAuth } from "../../hooks/useAuth";
import useSnackbar from "../../hooks/display/useSnackbar";
import { WorksheetType } from "../worksheet/types";
import {
  SPMLChangeType,
  SPMLScoreType,
  SPMLSyncTarget,
  SPMLWorksheetChangedEvent,
  WsSPMLJunctionType,
  WsSPMLRefreshOptions,
} from "./types";
import useLoading from "../../hooks/display/useLoading";
//-----------------------------------------------------------------------------------------------------------------
interface WsSPMLJunctionContextType {
  wsSPMLJunction: WsSPMLJunctionType[];
  wsDetail: WorksheetType | null;
  spmlScore: SPMLScoreType | null;
  isScoreLoading: boolean;
  lastLiveChange: SPMLWorksheetChangedEvent | null;
  lastRefreshedAt: Date | null;
  setWsSPMLJunction: React.Dispatch<React.SetStateAction<WsSPMLJunctionType[]>>;
  getWsSPMLJunctionKanwil: (kppnId: string, options?: WsSPMLRefreshOptions) => Promise<void>;
  getWsSPMLJunctionKPPN: (options?: WsSPMLRefreshOptions) => Promise<void>;
  getWorksheet: (kppnId: string) => Promise<void>;
  getSPMLScore: (worksheetSPMLId: string) => Promise<void>;
  resetSPMLScore: () => void;
  setLastLiveChange: React.Dispatch<React.SetStateAction<SPMLWorksheetChangedEvent | null>>;
  isJunctionSyncing: (junctionId: number, changeTypes?: SPMLChangeType[]) => boolean;
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
  lastLiveChange: null,
  lastRefreshedAt: null,
  setWsSPMLJunction: () => {},
  getWsSPMLJunctionKanwil: async () => {},
  getWsSPMLJunctionKPPN: async () => {},
  getWorksheet: async () => {},
  getSPMLScore: async () => {},
  resetSPMLScore: () => {},
  setLastLiveChange: () => {},
  isJunctionSyncing: () => false,
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
  const [lastLiveChange, setLastLiveChange] = useState<SPMLWorksheetChangedEvent | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const scoreRequestId = useRef(0);
  const junctionRequestId = useRef(0);
  const syncTargetCounts = useRef<Record<string, number>>({});
  const scoreRefreshPending = useRef(false);
  const [syncingJunctions, setSyncingJunctions] = useState<Record<number, SPMLChangeType[]>>({});
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
    scoreRefreshPending.current = false;
    setSpmlScore(null);
    setIsScoreLoading(false);
    setLastRefreshedAt(null);
  }

  const addSyncTargets = (targets: SPMLSyncTarget[]) => {
    if (targets.length === 0) return;
    setSyncingJunctions((current) => {
      const next = { ...current };
      targets.forEach(({ junctionId, changeType }) => {
        const key = `${junctionId}:${changeType}`;
        syncTargetCounts.current[key] = (syncTargetCounts.current[key] || 0) + 1;
        next[junctionId] = Array.from(new Set([...(next[junctionId] || []), changeType]));
      });
      return next;
    });
  };

  const removeSyncTargets = (targets: SPMLSyncTarget[]) => {
    if (targets.length === 0) return;
    setSyncingJunctions((current) => {
      const next = { ...current };
      targets.forEach(({ junctionId, changeType }) => {
        const key = `${junctionId}:${changeType}`;
        const remainingCount = Math.max((syncTargetCounts.current[key] || 1) - 1, 0);
        if (remainingCount > 0) {
          syncTargetCounts.current[key] = remainingCount;
          return;
        }
        delete syncTargetCounts.current[key];
        const remaining = (next[junctionId] || []).filter((type) => type !== changeType);
        if (remaining.length > 0) next[junctionId] = remaining;
        else delete next[junctionId];
      });
      return next;
    });
  };

  const isJunctionSyncing = (junctionId: number, changeTypes?: SPMLChangeType[]) => {
    const currentTypes = syncingJunctions[junctionId] || [];
    return changeTypes
      ? changeTypes.some((changeType) => currentTypes.includes(changeType))
      : currentTypes.length > 0;
  };

  async function getWsSPMLJunctionForKanwil(
    kppnId: string,
    options: WsSPMLRefreshOptions = {}
  ) {
    const { showOverlay = true, refreshScore = true, syncTargets = [] } = options;
    const requestId = ++junctionRequestId.current;
    if (refreshScore) scoreRefreshPending.current = true;
    if (showOverlay) setIsLoading(true);
    addSyncTargets(syncTargets);
    try {
      const response = await axiosJWT.get(
        `wsSPMLJunction/getWsSPMLJunctionByWorksheetForKanwil?kppn=${encodeURIComponent(kppnId)}&time=${Date.now()}`
      );
      const rows: WsSPMLJunctionType[] = response.data.rows;
      if (requestId === junctionRequestId.current) setWsSPMLJunction(rows);
      if (
        requestId === junctionRequestId.current &&
        scoreRefreshPending.current &&
        rows[0]?.worksheet_id
      ) {
        await getSPMLScore(rows[0].worksheet_id);
        if (requestId === junctionRequestId.current) scoreRefreshPending.current = false;
      } else if (requestId === junctionRequestId.current && rows.length === 0) {
        setSpmlScore(null);
      }
      if (requestId === junctionRequestId.current) setLastRefreshedAt(new Date());
    } catch (err: unknown) {
      if (showOverlay && requestId === junctionRequestId.current) setWsSPMLJunction([]);
      showRequestError(err);
    } finally {
      removeSyncTargets(syncTargets);
      if (showOverlay) setIsLoading(false);
    }
  }

  async function getWsSPMLJunctionKPPN(options: WsSPMLRefreshOptions = {}) {
    const { showOverlay = true, refreshScore = true, syncTargets = [] } = options;
    const requestId = ++junctionRequestId.current;
    if (refreshScore) scoreRefreshPending.current = true;
    if (showOverlay) setIsLoading(true);
    addSyncTargets(syncTargets);
    try {
      const response = await axiosJWT.get(
        `wsSPMLJunction/getWsSPMLJunctionByWorksheetForKPPN?time=${Date.now()}`
      );
      const rows: WsSPMLJunctionType[] = response.data.rows;
      if (requestId === junctionRequestId.current) setWsSPMLJunction(rows);
      if (
        requestId === junctionRequestId.current &&
        scoreRefreshPending.current &&
        rows[0]?.worksheet_id
      ) {
        await getSPMLScore(rows[0].worksheet_id);
        if (requestId === junctionRequestId.current) scoreRefreshPending.current = false;
      } else if (requestId === junctionRequestId.current && rows.length === 0) {
        setSpmlScore(null);
      }
      if (requestId === junctionRequestId.current) setLastRefreshedAt(new Date());
    } catch (err: unknown) {
      if (showOverlay && requestId === junctionRequestId.current) setWsSPMLJunction([]);
      showRequestError(err);
    } finally {
      removeSyncTargets(syncTargets);
      if (showOverlay) setIsLoading(false);
    }
  }

  async function getWsSPMLJunctionKanwil(kppnId: string, options?: WsSPMLRefreshOptions) {
    if (auth?.kppn?.length === 5) {
      await getWsSPMLJunctionForKanwil(kppnId, options);
      return;
    }

    await getWsSPMLJunctionKPPN(options);
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
        lastLiveChange,
        lastRefreshedAt,
        setWsSPMLJunction,
        getWsSPMLJunctionKanwil,
        getWsSPMLJunctionKPPN,
        getWorksheet,
        getSPMLScore,
        resetSPMLScore,
        setLastLiveChange,
        isJunctionSyncing,
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

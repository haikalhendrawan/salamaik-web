import { ReactNode, createContext, useContext, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import useAxiosJWT from '../../hooks/useAxiosJWT';
import { useAuth } from '../../hooks/useAuth';
import useSnackbar from '../../hooks/display/useSnackbar';
import useLoading from '../../hooks/display/useLoading';
import { WorksheetType } from '../worksheet/types';
import {
  CKChangeType,
  CKScoreType,
  CKSyncTarget,
  CKWorksheetChangedEvent,
  WsCKJunctionType,
  WsCKRefreshOptions,
} from './types';

interface WsCKJunctionContextType {
  wsCKJunction: WsCKJunctionType[];
  wsDetail: WorksheetType | null;
  ckScore: CKScoreType | null;
  isScoreLoading: boolean;
  lastLiveChange: CKWorksheetChangedEvent | null;
  lastRefreshedAt: Date | null;
  setWsCKJunction: React.Dispatch<React.SetStateAction<WsCKJunctionType[]>>;
  getWsCKJunction: (kppnId: string, options?: WsCKRefreshOptions) => Promise<void>;
  getWorksheet: (kppnId: string) => Promise<void>;
  getCKScore: (worksheetCKId: string) => Promise<void>;
  resetCKScore: () => void;
  setLastLiveChange: React.Dispatch<React.SetStateAction<CKWorksheetChangedEvent | null>>;
  isJunctionSyncing: (junctionId: number, changeTypes?: CKChangeType[]) => boolean;
}

const WsCKJunctionContext = createContext<WsCKJunctionContextType>({
  wsCKJunction: [],
  wsDetail: null,
  ckScore: null,
  isScoreLoading: false,
  lastLiveChange: null,
  lastRefreshedAt: null,
  setWsCKJunction: () => {},
  getWsCKJunction: async () => {},
  getWorksheet: async () => {},
  getCKScore: async () => {},
  resetCKScore: () => {},
  setLastLiveChange: () => {},
  isJunctionSyncing: () => false,
});

function WsCKJunctionProvider({ children }: { children: ReactNode }) {
  const axiosJWT = useAxiosJWT();
  const { auth } = useAuth();
  const { openSnackbar } = useSnackbar();
  const { setIsLoading } = useLoading();
  const [wsCKJunction, setWsCKJunction] = useState<WsCKJunctionType[]>([]);
  const [wsDetail, setWsDetail] = useState<WorksheetType | null>(null);
  const [ckScore, setCkScore] = useState<CKScoreType | null>(null);
  const [isScoreLoading, setIsScoreLoading] = useState(false);
  const [lastLiveChange, setLastLiveChange] = useState<CKWorksheetChangedEvent | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const [syncingJunctions, setSyncingJunctions] = useState<Record<number, CKChangeType[]>>({});
  const requestId = useRef(0);
  const scoreRequestId = useRef(0);
  const scoreRefreshPending = useRef(false);
  const syncCounts = useRef<Record<string, number>>({});

  const showError = (error: unknown) => {
    if (isAxiosError<{ message?: string }>(error)) {
      openSnackbar(error.response?.data?.message || error.message, 'error');
      return;
    }
    openSnackbar(error instanceof Error ? error.message : 'Unknown error', 'error');
  };

  async function getCKScore(worksheetCKId: string) {
    if (!worksheetCKId) return;

    const currentRequest = ++scoreRequestId.current;
    setIsScoreLoading(true);
    try {
      const response = await axiosJWT.get(
        `/scoringEngine/ck/${encodeURIComponent(worksheetCKId)}`
      );
      if (currentRequest === scoreRequestId.current) {
        setCkScore(response.data.rows);
      }
    } catch (error: unknown) {
      if (currentRequest === scoreRequestId.current) showError(error);
    } finally {
      if (currentRequest === scoreRequestId.current) setIsScoreLoading(false);
    }
  }

  function resetCKScore() {
    scoreRequestId.current += 1;
    scoreRefreshPending.current = false;
    setCkScore(null);
    setIsScoreLoading(false);
    setLastRefreshedAt(null);
  }

  const addSyncTargets = (targets: CKSyncTarget[]) => {
    if (!targets.length) return;
    setSyncingJunctions((current) => {
      const next = { ...current };
      targets.forEach(({ junctionId, changeType }) => {
        const key = `${junctionId}:${changeType}`;
        syncCounts.current[key] = (syncCounts.current[key] || 0) + 1;
        next[junctionId] = Array.from(new Set([...(next[junctionId] || []), changeType]));
      });
      return next;
    });
  };

  const removeSyncTargets = (targets: CKSyncTarget[]) => {
    if (!targets.length) return;
    setSyncingJunctions((current) => {
      const next = { ...current };
      targets.forEach(({ junctionId, changeType }) => {
        const key = `${junctionId}:${changeType}`;
        const count = Math.max((syncCounts.current[key] || 1) - 1, 0);
        if (count) {
          syncCounts.current[key] = count;
          return;
        }
        delete syncCounts.current[key];
        const remaining = (next[junctionId] || []).filter((item) => item !== changeType);
        if (remaining.length) next[junctionId] = remaining;
        else delete next[junctionId];
      });
      return next;
    });
  };

  const isJunctionSyncing = (junctionId: number, changeTypes?: CKChangeType[]) => {
    const activeTypes = syncingJunctions[junctionId] || [];
    return changeTypes
      ? changeTypes.some((changeType) => activeTypes.includes(changeType))
      : activeTypes.length > 0;
  };

  async function getWsCKJunction(kppnId: string, options: WsCKRefreshOptions = {}) {
    const { showOverlay = true, refreshScore = true, syncTargets = [] } = options;
    const currentRequest = ++requestId.current;
    if (refreshScore) scoreRefreshPending.current = true;
    if (showOverlay) setIsLoading(true);
    addSyncTargets(syncTargets);
    try {
      const isKanwil = auth?.kppn?.length === 5;
      const endpoint = isKanwil
        ? `/wsCKJunction/getWsCKJunctionByWorksheetForKanwil?kppn=${encodeURIComponent(kppnId)}&time=${Date.now()}`
        : `/wsCKJunction/getWsCKJunctionByWorksheetForKPPN?time=${Date.now()}`;
      const response = await axiosJWT.get(endpoint);
      const rows: WsCKJunctionType[] = response.data.rows;
      if (currentRequest === requestId.current) {
        setWsCKJunction(rows);
      }
      if (
        currentRequest === requestId.current &&
        scoreRefreshPending.current &&
        rows[0]?.worksheet_id
      ) {
        await getCKScore(rows[0].worksheet_id);
        if (currentRequest === requestId.current) scoreRefreshPending.current = false;
      } else if (currentRequest === requestId.current && rows.length === 0) {
        setCkScore(null);
      }
      if (currentRequest === requestId.current) {
        setLastRefreshedAt(new Date());
      }
    } catch (error: unknown) {
      if (showOverlay && currentRequest === requestId.current) setWsCKJunction([]);
      showError(error);
    } finally {
      removeSyncTargets(syncTargets);
      if (showOverlay) setIsLoading(false);
    }
  }

  async function getWorksheet(kppnId: string) {
    setIsLoading(true);
    try {
      const response = await axiosJWT.get(`/getWorksheetByPeriodAndKPPN/${kppnId}`);
      setWsDetail(response.data.rows);
    } catch (error: unknown) {
      setWsDetail(null);
      showError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <WsCKJunctionContext.Provider
      value={{
        wsCKJunction,
        wsDetail,
        ckScore,
        isScoreLoading,
        lastLiveChange,
        lastRefreshedAt,
        setWsCKJunction,
        getWsCKJunction,
        getWorksheet,
        getCKScore,
        resetCKScore,
        setLastLiveChange,
        isJunctionSyncing,
      }}
    >
      {children}
    </WsCKJunctionContext.Provider>
  );
}

const useWsCKJunction = () => useContext(WsCKJunctionContext);

// eslint-disable-next-line react-refresh/only-export-components
export default useWsCKJunction;
export { WsCKJunctionProvider };

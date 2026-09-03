import { ReactNode, createContext, useContext, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import useAxiosJWT from '../../hooks/useAxiosJWT';
import { useAuth } from '../../hooks/useAuth';
import useSnackbar from '../../hooks/display/useSnackbar';
import useLoading from '../../hooks/display/useLoading';
import { WorksheetType } from '../worksheet/types';
import {
  CKChangeType,
  CKSyncTarget,
  CKWorksheetChangedEvent,
  WsCKJunctionType,
  WsCKRefreshOptions,
} from './types';

interface WsCKJunctionContextType {
  wsCKJunction: WsCKJunctionType[];
  wsDetail: WorksheetType | null;
  lastLiveChange: CKWorksheetChangedEvent | null;
  lastRefreshedAt: Date | null;
  setWsCKJunction: React.Dispatch<React.SetStateAction<WsCKJunctionType[]>>;
  getWsCKJunction: (kppnId: string, options?: WsCKRefreshOptions) => Promise<void>;
  getWorksheet: (kppnId: string) => Promise<void>;
  setLastLiveChange: React.Dispatch<React.SetStateAction<CKWorksheetChangedEvent | null>>;
  isJunctionSyncing: (junctionId: number, changeTypes?: CKChangeType[]) => boolean;
}

const WsCKJunctionContext = createContext<WsCKJunctionContextType>({
  wsCKJunction: [],
  wsDetail: null,
  lastLiveChange: null,
  lastRefreshedAt: null,
  setWsCKJunction: () => {},
  getWsCKJunction: async () => {},
  getWorksheet: async () => {},
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
  const [lastLiveChange, setLastLiveChange] = useState<CKWorksheetChangedEvent | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);
  const [syncingJunctions, setSyncingJunctions] = useState<Record<number, CKChangeType[]>>({});
  const requestId = useRef(0);
  const syncCounts = useRef<Record<string, number>>({});

  const showError = (error: unknown) => {
    if (isAxiosError<{ message?: string }>(error)) {
      openSnackbar(error.response?.data?.message || error.message, 'error');
      return;
    }
    openSnackbar(error instanceof Error ? error.message : 'Unknown error', 'error');
  };

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
    const { showOverlay = true, syncTargets = [] } = options;
    const currentRequest = ++requestId.current;
    if (showOverlay) setIsLoading(true);
    addSyncTargets(syncTargets);
    try {
      const isKanwil = auth?.kppn?.length === 5;
      const endpoint = isKanwil
        ? `/wsCKJunction/getWsCKJunctionByWorksheetForKanwil?kppn=${encodeURIComponent(kppnId)}&time=${Date.now()}`
        : `/wsCKJunction/getWsCKJunctionByWorksheetForKPPN?time=${Date.now()}`;
      const response = await axiosJWT.get(endpoint);
      if (currentRequest === requestId.current) {
        setWsCKJunction(response.data.rows);
        setLastRefreshedAt(new Date());
      }
    } catch (error: unknown) {
      if (showOverlay && currentRequest === requestId.current) setWsCKJunction([]);
      showError(error);
    } finally {
      removeSyncTargets(syncTargets);
      if (showOverlay) setIsLoading(false);
    }
  };

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
  };

  return (
    <WsCKJunctionContext.Provider
      value={{
        wsCKJunction,
        wsDetail,
        lastLiveChange,
        lastRefreshedAt,
        setWsCKJunction,
        getWsCKJunction,
        getWorksheet,
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

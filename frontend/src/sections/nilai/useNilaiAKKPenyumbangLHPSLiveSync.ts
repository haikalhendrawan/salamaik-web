import { useEffect, useMemo, useRef } from 'react';
import { debounce } from 'lodash';
import useSocket from '../../hooks/useSocket';
import { AKKScoreChangedEvent } from './types';

type RefreshScores = (event?: AKKScoreChangedEvent) => Promise<void>;

export default function useNilaiAKKPenyumbangLHPSLiveSync(
  worksheetIds: string[],
  refresh: RefreshScores
) {
  const { socket } = useSocket();
  const refreshRef = useRef(refresh);
  const worksheetKey = useMemo(
    () => Array.from(new Set(worksheetIds.filter(Boolean))).sort().join('|'),
    [worksheetIds]
  );

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  useEffect(() => {
    if (!socket || !worksheetKey) return undefined;

    const activeWorksheetIds = worksheetKey.split('|');
    const activeWorksheetSet = new Set(activeWorksheetIds);
    const joinWorksheets = () => {
      activeWorksheetIds.forEach((worksheetId) => {
        socket.emit('joinAKKWorksheet', worksheetId, () => undefined);
      });
    };
    const refreshScores = debounce((event?: AKKScoreChangedEvent) => {
      void refreshRef.current(event);
    }, 300);
    const handleScoreChange = (event: AKKScoreChangedEvent) => {
      if (activeWorksheetSet.has(event?.worksheetId)) refreshScores(event);
    };
    const handleReconnect = () => {
      joinWorksheets();
      refreshScores();
    };

    joinWorksheets();
    socket.on('connect', handleReconnect);
    socket.on('akkScoreChanged', handleScoreChange);

    return () => {
      refreshScores.cancel();
      socket.off('connect', handleReconnect);
      socket.off('akkScoreChanged', handleScoreChange);
      activeWorksheetIds.forEach((worksheetId) => {
        socket.emit('leaveAKKWorksheet', worksheetId);
      });
    };
  }, [socket, worksheetKey]);
}

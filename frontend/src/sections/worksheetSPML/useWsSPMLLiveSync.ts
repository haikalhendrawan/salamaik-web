import { useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import useSocket from '../../hooks/useSocket';
import useWsSPMLJunction from './useWsSPMLJunction';
import { SPMLWorksheetChangedEvent } from './types';

export default function useWsSPMLLiveSync(worksheetId: string | undefined, kppnId: string) {
  const { socket } = useSocket();
  const { getWsSPMLJunctionKanwil, setLastLiveChange } = useWsSPMLJunction();
  const refreshRef = useRef(getWsSPMLJunctionKanwil);

  useEffect(() => {
    refreshRef.current = getWsSPMLJunctionKanwil;
  }, [getWsSPMLJunctionKanwil]);

  useEffect(() => {
    if (!socket || !worksheetId) return undefined;

    const joinWorksheet = () => {
      socket.emit('joinSPMLWorksheet', worksheetId, () => undefined);
    };

    const pendingChanges = new Map<string, SPMLWorksheetChangedEvent>();

    const refreshWorksheet = debounce(() => {
      const changes = Array.from(pendingChanges.values());
      pendingChanges.clear();
      refreshRef.current(kppnId, {
        showOverlay: false,
        refreshScore: changes.some((change) => change.changeType === 'score'),
        syncTargets: changes.map(({ junctionId, changeType }) => ({ junctionId, changeType })),
      });
    }, 250);

    const handleChange = (event: SPMLWorksheetChangedEvent) => {
      if (event?.worksheetId !== worksheetId) return;
      setLastLiveChange(event);
      pendingChanges.set(`${event.junctionId}:${event.changeType}`, event);
      refreshWorksheet();
    };

    joinWorksheet();
    socket.on('connect', joinWorksheet);
    socket.on('spmlWorksheetChanged', handleChange);

    return () => {
      refreshWorksheet.cancel();
      socket.off('connect', joinWorksheet);
      socket.off('spmlWorksheetChanged', handleChange);
      socket.emit('leaveSPMLWorksheet', worksheetId);
    };
  }, [kppnId, setLastLiveChange, socket, worksheetId]);
}

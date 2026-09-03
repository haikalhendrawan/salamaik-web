import { useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import useSocket from '../../hooks/useSocket';
import useWsCKJunction from './useWsCKJunction';
import { CKWorksheetChangedEvent } from './types';

export default function useWsCKLiveSync(worksheetId: string | undefined, kppnId: string) {
  const { socket } = useSocket();
  const { getWsCKJunction, setLastLiveChange } = useWsCKJunction();
  const refreshRef = useRef(getWsCKJunction);

  useEffect(() => {
    refreshRef.current = getWsCKJunction;
  }, [getWsCKJunction]);

  useEffect(() => {
    if (!socket || !worksheetId) return undefined;

    const joinWorksheet = () => socket.emit('joinCKWorksheet', worksheetId, () => undefined);
    const pendingChanges = new Map<string, CKWorksheetChangedEvent>();
    const refreshWorksheet = debounce(() => {
      const changes = Array.from(pendingChanges.values());
      pendingChanges.clear();
      void refreshRef.current(kppnId, {
        showOverlay: false,
        syncTargets: changes.map(({ junctionId, changeType }) => ({ junctionId, changeType })),
      });
    }, 250);
    const handleChange = (event: CKWorksheetChangedEvent) => {
      if (event?.worksheetId !== worksheetId) return;
      setLastLiveChange(event);
      pendingChanges.set(`${event.junctionId}:${event.changeType}`, event);
      refreshWorksheet();
    };

    joinWorksheet();
    socket.on('connect', joinWorksheet);
    socket.on('ckWorksheetChanged', handleChange);

    return () => {
      refreshWorksheet.cancel();
      socket.off('connect', joinWorksheet);
      socket.off('ckWorksheetChanged', handleChange);
      socket.emit('leaveCKWorksheet', worksheetId);
    };
  }, [kppnId, setLastLiveChange, socket, worksheetId]);
}

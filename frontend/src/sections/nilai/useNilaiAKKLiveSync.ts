import { useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import useSocket from '../../hooks/useSocket';
import { AKKScoreChangedEvent } from './types';

type RefreshScore = (options?: { silent?: boolean }) => Promise<void>;

export default function useNilaiAKKLiveSync(
  worksheetId: string | undefined,
  refresh: RefreshScore
) {
  const { socket } = useSocket();
  const refreshRef = useRef(refresh);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  useEffect(() => {
    if (!socket || !worksheetId) return undefined;

    const joinWorksheet = (refreshAfterJoin = false) => {
      socket.emit(
        'joinAKKWorksheet',
        worksheetId,
        (response: { success: boolean }) => {
          if (response?.success && refreshAfterJoin) {
            void refreshRef.current({ silent: true });
          }
        }
      );
    };
    const refreshScore = debounce(() => {
      void refreshRef.current({ silent: true });
    }, 300);
    const handleScoreChange = (event: AKKScoreChangedEvent) => {
      if (event?.worksheetId === worksheetId) refreshScore();
    };
    const handleReconnect = () => joinWorksheet(true);

    joinWorksheet();
    socket.on('connect', handleReconnect);
    socket.on('akkScoreChanged', handleScoreChange);

    return () => {
      refreshScore.cancel();
      socket.off('connect', handleReconnect);
      socket.off('akkScoreChanged', handleScoreChange);
      socket.emit('leaveAKKWorksheet', worksheetId);
    };
  }, [socket, worksheetId]);
}

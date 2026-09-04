import { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, TextField } from '@mui/material';
import { useAuth } from '../../../../../hooks/useAuth';
import useSocket from '../../../../../hooks/useSocket';
import useSnackbar from '../../../../../hooks/display/useSnackbar';
import useWsSPMLJunction from '../../../useWsSPMLJunction';
import { WsSPMLJunctionType } from '../../../types';

const KANWIL_ROLES = [99, 4, 3];

interface KanwilNoteProps {
  checklist: WsSPMLJunctionType;
  isPastDue: boolean;
}

export default function KanwilNote({ checklist, isPastDue }: KanwilNoteProps) {
  const { auth } = useAuth();
  const { socket } = useSocket();
  const { openSnackbar } = useSnackbar();
  const { getWsSPMLJunctionKanwil, isJunctionSyncing } = useWsSPMLJunction();
  const [draft, setDraft] = useState(checklist.kanwil_note || '');
  const [isFocused, setIsFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const lastSavedNote = useRef(checklist.kanwil_note || '');
  const isFocusedRef = useRef(false);
  const isDirtyRef = useRef(false);
  const isSyncing = isJunctionSyncing(checklist.junction_id, ['note']);
  const isKanwil = KANWIL_ROLES.includes(auth?.role ?? -1);

  useEffect(() => {
    const serverNote = checklist.kanwil_note || '';
    lastSavedNote.current = serverNote;
    if (!isFocusedRef.current || !isDirtyRef.current) {
      setDraft(serverNote);
      isDirtyRef.current = false;
    }
  }, [checklist.kanwil_note]);

  const saveNote = async () => {
    isFocusedRef.current = false;
    setIsFocused(false);
    if (!isDirtyRef.current || draft === lastSavedNote.current) {
      isDirtyRef.current = false;
      return;
    }
    if (!socket?.connected) {
      openSnackbar('WebSocket tidak terhubung', 'error');
      return;
    }

    setIsSaving(true);
    socket.emit(
      'updateSPMLKanwilNote',
      {
        worksheetId: checklist.worksheet_id,
        junctionId: checklist.junction_id,
        kanwilNote: draft,
      },
      async (response: { success: boolean; message?: string }) => {
        try {
          if (!response?.success) {
            openSnackbar(response?.message || 'Gagal menyimpan catatan Kanwil SPML', 'error');
            return;
          }

          const normalizedNote = draft.trim();
          lastSavedNote.current = normalizedNote;
          isDirtyRef.current = false;
          setDraft(normalizedNote);
          await getWsSPMLJunctionKanwil(checklist.kppn_id || '', {
            showOverlay: false,
            refreshScore: false,
          });
        } catch (error: unknown) {
          openSnackbar(
            error instanceof Error ? error.message : 'Gagal memperbarui catatan Kanwil SPML',
            'error'
          );
        } finally {
          setIsSaving(false);
        }
      }
    );
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        value={draft}
        onChange={(event) => {
          isDirtyRef.current = true;
          setDraft(event.target.value);
        }}
        onFocus={() => {
          isFocusedRef.current = true;
          setIsFocused(true);
        }}
        onBlur={saveNote}
        disabled={!isKanwil || isPastDue || isSaving || (isSyncing && !isFocused)}
        multiline
        minRows={3}
        maxRows={5}
        fullWidth
        size="small"
        placeholder="Catatan Kanwil"
        inputProps={{
          maxLength: 5000,
          spellCheck: false,
          sx: { fontSize: 12 },
          'aria-label': `Catatan Kanwil untuk ${checklist.uraian}`,
        }}
      />
      {(isSaving || isSyncing) && (
        <CircularProgress size={14} sx={{ position: 'absolute', right: 8, top: 8 }} />
      )}
    </Box>
  );
}

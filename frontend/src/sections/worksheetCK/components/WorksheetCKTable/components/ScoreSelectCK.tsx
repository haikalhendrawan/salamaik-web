import { useState } from 'react';
import {
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useSocket from '../../../../../hooks/useSocket';
import useSnackbar from '../../../../../hooks/display/useSnackbar';
import useWsCKJunction from '../../../useWsCKJunction';
import { WsCKJunctionType } from '../../../types';

const StyledMenuItem = styled(MenuItem)({ fontSize: 12 });
const StyledFormControl = styled(FormControl)({ width: '100%', minWidth: 76, position: 'relative' });
const StyledSelect = styled(Select)({ fontSize: 12 });

interface ScoreSelectCKProps {
  checklist: WsCKJunctionType;
  scoreType: 'kppn' | 'kanwil';
  disabled: boolean;
}

export default function ScoreSelectCK({ checklist, scoreType, disabled }: ScoreSelectCKProps) {
  const { socket } = useSocket();
  const { openSnackbar } = useSnackbar();
  const { getWsCKJunction, isJunctionSyncing } = useWsCKJunction();
  const [isSaving, setIsSaving] = useState(false);
  const score = scoreType === 'kppn' ? checklist.kppn_score : checklist.kanwil_score;
  const value = checklist.excluded === 1 ? 'N/A' : score?.toString() ?? '';
  const isSyncing = isJunctionSyncing(checklist.junction_id, ['score']);
  const options = [...(checklist.opsi || [])].sort(
    (left, right) => left.urut - right.urut || right.value - left.value
  );

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    if (disabled || !socket?.connected) {
      if (!socket?.connected) openSnackbar('WebSocket tidak terhubung', 'error');
      return;
    }

    const selected = String(event.target.value);
    if (!selected) return;
    const selectedScore = selected === 'N/A' ? 10 : Number(selected);
    const eventName = scoreType === 'kppn' ? 'updateCKKPPNScore' : 'updateCKKanwilScore';
    const scorePayload = scoreType === 'kppn'
      ? { kppnScore: selectedScore }
      : { kanwilScore: selectedScore };
    setIsSaving(true);
    socket.emit(
      eventName,
      {
        worksheetId: checklist.worksheet_id,
        junctionId: checklist.junction_id,
        excluded: selected === 'N/A' ? 1 : 0,
        ...scorePayload,
      },
      async (response: { success: boolean; message?: string }) => {
        try {
          if (!response?.success) {
            openSnackbar(response?.message || 'Gagal menyimpan nilai CK', 'error');
            return;
          }
          await getWsCKJunction(checklist.kppn_id, { showOverlay: false });
        } catch (error: unknown) {
          openSnackbar(error instanceof Error ? error.message : 'Gagal memperbarui data CK', 'error');
        } finally {
          setIsSaving(false);
        }
      }
    );
  };

  return (
    <StyledFormControl size="small">
      <StyledSelect
        value={value}
        onChange={handleChange}
        disabled={disabled || isSaving || isSyncing}
        displayEmpty
        inputProps={{
          'aria-label': `Nilai ${scoreType === 'kppn' ? 'KPPN' : 'Kanwil'} untuk ${checklist.materi}`,
        }}
      >
        {options.map((option) => (
          <StyledMenuItem key={option.id} value={String(option.value)}>
            {option.value}
          </StyledMenuItem>
        ))}
        <StyledMenuItem value="N/A">N/A</StyledMenuItem>
        <StyledMenuItem value="" disabled>&nbsp;</StyledMenuItem>
      </StyledSelect>
      {(isSaving || isSyncing) && (
        <CircularProgress size={14} sx={{ position: 'absolute', right: 8, top: 'calc(50% - 7px)' }} />
      )}
    </StyledFormControl>
  );
}

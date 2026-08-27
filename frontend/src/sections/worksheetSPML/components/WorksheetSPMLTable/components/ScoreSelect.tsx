import { CircularProgress, Select, MenuItem, FormControl, SelectChangeEvent } from '@mui/material';
import {styled}  from '@mui/material/styles';
import { useState } from 'react';
import useSocket from '../../../../../hooks/useSocket';
import useSnackbar from '../../../../../hooks/display/useSnackbar';
import useWsSPMLJunction from '../../../useWsSPMLJunction';
import { WsSPMLJunctionType } from '../../../types';
//-----------------------------------------------------------------------------------------------------------------

interface ScoreSelectProps {
  checklist: WsSPMLJunctionType;
  scoreType: 'kppn' | 'kanwil';
  disabled: boolean;
}

const StyledMenuItem = styled(MenuItem)(() => ({
  fontSize: 12,
}));

const StyledFormControl = styled(FormControl)(() => ({
  width: '100%',
  minWidth: 72,
  position: 'relative',
}));

const StyledSelect = styled(Select)(() => ({
  fontSize: 12,
  typography: 'body2',
}));

//-----------------------------------------------------------------------------------------------------------------

export default function ScoreSelect({ checklist, scoreType, disabled }: ScoreSelectProps) {
  const { socket } = useSocket();
  const { openSnackbar } = useSnackbar();
  const { getWsSPMLJunctionKanwil, isJunctionSyncing } = useWsSPMLJunction();
  const [isSaving, setIsSaving] = useState(false);

  const score = scoreType === 'kppn' ? checklist.kppn_score : checklist.kanwil_score;
  const value = checklist.excluded === 1 ? 'N/A' : score?.toString() ?? '';
  const isLiveSyncing = isJunctionSyncing(checklist.junction_id, ['score']);

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const selectedValue = event.target.value as string;

    if (selectedValue === '') {
      return;
    }

    if (!socket?.connected) {
      openSnackbar('websocket failed, check your connection', 'error');
      return;
    }

    const excluded = selectedValue === 'N/A' ? 1 : 0;
    const selectedScore = selectedValue === 'N/A' ? 10 : Number(selectedValue);
    const eventName = scoreType === 'kppn' ? 'updateSPMLKPPNScore' : 'updateSPMLKanwilScore';
    const scorePayload = scoreType === 'kppn'
      ? { kppnScore: selectedScore }
      : { kanwilScore: selectedScore };

    setIsSaving(true);
    socket.emit(
      eventName,
      {
        worksheetId: checklist.worksheet_id,
        junctionId: checklist.junction_id,
        excluded,
        ...scorePayload,
      },
      async (response: { success: boolean; message: string }) => {
        try {
          if (!response?.success) {
            openSnackbar(response?.message || 'Gagal menyimpan nilai SPML', 'error');
            return;
          }

          await getWsSPMLJunctionKanwil(checklist.kppn_id ?? '', { showOverlay: false });
        } catch (err: unknown) {
          openSnackbar(err instanceof Error ? err.message : 'Gagal memperbarui data SPML', 'error');
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
      disabled={disabled || isSaving || isLiveSyncing}
        displayEmpty
        inputProps={{
          'aria-label': `Nilai ${scoreType === 'kppn' ? 'KPPN' : 'Kanwil'} untuk ${checklist.uraian}`,
          name: `${scoreType}Score-${checklist.id}`,
        }}
        size="small"
      >
        <StyledMenuItem value="10">10</StyledMenuItem>
        <StyledMenuItem value="0">0</StyledMenuItem>
        <StyledMenuItem value="N/A">N/A</StyledMenuItem>
        <StyledMenuItem value="" disabled>&nbsp;</StyledMenuItem>
      </StyledSelect>
      {isLiveSyncing && (
        <CircularProgress
          size={14}
          sx={{ position: 'absolute', right: 8, top: 'calc(50% - 7px)', zIndex: 1 }}
        />
      )}
    </StyledFormControl>
  );
}

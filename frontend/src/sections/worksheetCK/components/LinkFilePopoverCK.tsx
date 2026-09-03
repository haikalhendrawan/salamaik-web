import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ClickAwayListener,
  FormControl,
  Grow,
  Paper,
  Popper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Iconify from '../../../components/iconify/Iconify';
import useSocket from '../../../hooks/useSocket';
import useSnackbar from '../../../hooks/display/useSnackbar';
import useWsCKJunction from '../useWsCKJunction';
import { WsCKJunctionType } from '../types';

const popoverStyle = {
  p: 2,
  mt: 1.5,
  ml: 0.75,
  width: 300,
  typography: 'body2',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
};

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(0.5),
  width: '100%',
  height: '100%',
}));

interface LinkFilePopoverCKProps {
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
  checklist: WsCKJunctionType;
  disabled: boolean;
}

export default function LinkFilePopoverCK({
  anchorEl,
  onClose,
  checklist,
  disabled,
}: LinkFilePopoverCKProps) {
  const theme = useTheme();
  const { socket } = useSocket();
  const { openSnackbar } = useSnackbar();
  const { getWsCKJunction, isJunctionSyncing } = useWsCKJunction();
  const [value, setValue] = useState(checklist.link_file || '');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const syncing = isJunctionSyncing(checklist.junction_id, ['link']);
  const hasStoredLink = Boolean(checklist.link_file);

  useEffect(() => {
    setValue(checklist.link_file || '');
    setEditing(false);
  }, [checklist.link_file, anchorEl]);

  const save = (nextValue: string) => {
    if (disabled || !socket?.connected) {
      if (!socket?.connected) openSnackbar('WebSocket tidak terhubung', 'error');
      return;
    }
    if (nextValue.length > 2048) {
      openSnackbar('Link maksimal 2048 karakter', 'error');
      return;
    }

    setSaving(true);
    socket.emit(
      'updateCKLinkFile',
      {
        worksheetId: checklist.worksheet_id,
        junctionId: checklist.junction_id,
        linkFile: nextValue,
      },
      async (response: { success: boolean; message?: string }) => {
        try {
          if (!response?.success) {
            openSnackbar(response?.message || 'Gagal menyimpan link CK', 'error');
            return;
          }
          await getWsCKJunction(checklist.kppn_id, { showOverlay: false });
          setValue(nextValue);
          setEditing(false);
          openSnackbar(nextValue ? 'Link berhasil disimpan' : 'Link berhasil dihapus', 'success');
        } finally {
          setSaving(false);
        }
      }
    );
  };

  const openLink = () => {
    const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    window.open(normalized, '_blank', 'noopener,noreferrer');
  };

  return (
    <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="top-start" transition sx={{ zIndex: 9999 }}>
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} timeout={200}>
          <Paper sx={{ ...popoverStyle, boxShadow: theme.customShadows.dialog }}>
            <ClickAwayListener onClickAway={onClose}>
              <Stack direction="column" spacing={1.5}>
                <Typography variant="subtitle2" fontSize={13} textAlign="left">
                  Link Bukti Dukung
                </Typography>
                {hasStoredLink && !editing ? (
                  <Stack direction="column" spacing={1}>
                    <Typography
                      variant="body2"
                      fontSize={11}
                      color="text.secondary"
                      sx={{ wordBreak: 'break-all' }}
                    >
                      {value}
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="flex-start" alignItems="center">
                      <Tooltip title="Buka link di tab baru">
                        <Button
                          aria-label="open-link"
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={openLink}
                          startIcon={<Iconify icon="solar:eye-bold" />}
                        >
                          Buka
                        </Button>
                      </Tooltip>
                      {!disabled && (
                        <>
                          <Tooltip title="Edit link">
                            <Button
                              aria-label="edit-link"
                              variant="contained"
                              size="small"
                              color="secondary"
                              onClick={() => setEditing(true)}
                              disabled={saving || syncing}
                              startIcon={<Iconify icon="solar:pen-bold" />}
                            >
                              Edit
                            </Button>
                          </Tooltip>
                          <Tooltip title="Hapus link">
                            <Button
                              aria-label="delete-link"
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={() => save('')}
                              disabled={saving || syncing}
                              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                            >
                              Hapus
                            </Button>
                          </Tooltip>
                        </>
                      )}
                    </Stack>
                  </Stack>
                ) : (
                  <Stack direction="column" spacing={1}>
                    <StyledFormControl>
                      <TextField
                        size="small"
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        placeholder="Masukkan link bukti dukung..."
                        multiline
                        minRows={4}
                        maxRows={6}
                        fullWidth
                        inputProps={{
                          sx: { fontSize: 12, width: '100%', height: '100%' },
                          spellCheck: false,
                        }}
                        disabled={disabled || saving || syncing}
                      />
                    </StyledFormControl>
                    {!disabled && (
                      <Box>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          {editing && (
                            <Button
                              size="small"
                              variant="text"
                              color="inherit"
                              onClick={() => {
                                setValue(checklist.link_file || '');
                                setEditing(false);
                              }}
                              disabled={saving || syncing}
                            >
                              Batal
                            </Button>
                          )}
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={() => save(value.trim())}
                            disabled={saving || syncing || !value.trim()}
                          >
                            Simpan
                          </Button>
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                )}
              </Stack>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}

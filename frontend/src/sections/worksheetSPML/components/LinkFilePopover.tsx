/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { useMemo, useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Stack, Popper, Paper, Grow, ClickAwayListener, Box, FormControl, TextField, Typography, Button, Tooltip } from "@mui/material";
import styled from "@mui/material/styles/styled";
import useSocket from "../../../hooks/useSocket";
import useWsSPMLJunction from "../useWsSPMLJunction";
import useSnackbar from "../../../hooks/display/useSnackbar";
import useLoading from "../../../hooks/display/useLoading";
import Iconify from "../../../components/iconify/Iconify";
import { WsSPMLJunctionType } from "../types";
import { WorksheetType } from "../../worksheet/types";
//-----------------------------------------------------------------------------------------------------------------
const style = {
  p: 2,
  mt: 1.5,
  ml: 0.75,
  width: 300,
  typography: 'body2',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column'
};

interface LinkFilePopoverProps {
  open: boolean,
  anchorEl: EventTarget & HTMLButtonElement | null,
  handleClose: () => void,
  wsJunction: WsSPMLJunctionType,
  wsDetail: WorksheetType | null,
}

interface SocketResponse {
  success: boolean;
  message?: string;
}

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  paddingRight: theme.spacing(1),
  paddingTop: theme.spacing(0.5),
  width: '100%',
  height: '100%',
}));
//-----------------------------------------------------------------------------------------------------------------
export default function LinkFilePopover({ open, anchorEl, handleClose, wsJunction, wsDetail }: LinkFilePopoverProps) {
  const [linkFile, setLinkFile] = useState(wsJunction?.link_file || '');
  const [isEditing, setIsEditing] = useState(false);

  const theme = useTheme();
  const { socket } = useSocket();
  const { getWsSPMLJunctionKanwil } = useWsSPMLJunction();
  const { openSnackbar } = useSnackbar();
  const { setIsLoading } = useLoading();

  const isPastDue = useMemo(() => new Date().getTime() > new Date(wsDetail?.close_period || "").getTime(), [wsDetail]);

  const handleEditLinkFile = () => {
    const normalizedLink = linkFile.trim();
    if (!normalizedLink || normalizedLink.length > 2048) {
      openSnackbar("Link wajib diisi dan maksimal 2048 karakter", "error");
      return;
    }
    if (!socket?.connected) {
      return openSnackbar("websocket failed, check your connection", "error");
    }

    setIsLoading(true);
    socket.emit("updateSPMLLinkFile", {
      worksheetId: wsJunction?.worksheet_id,
      junctionId: wsJunction?.junction_id,
      linkFile: normalizedLink,
    },
      async (response: SocketResponse) => {
        try {
          if (!response?.success) {
            openSnackbar(response?.message || "Failed to update link file", "error");
            return;
          }
          await getWsSPMLJunctionKanwil(wsJunction.kppn_id ?? '');
          openSnackbar(response?.message || "Success", "success");
          setIsEditing(false);
        } catch (err: unknown) {
          openSnackbar(err instanceof Error ? err.message : 'Unknown error', 'error');
        } finally {
          setIsLoading(false);
        }
      });
  };

  const handleDeleteLinkFile = () => {
    if (!socket?.connected) {
      return openSnackbar("websocket failed, check your connection", "error");
    }

    setIsLoading(true);
    socket.emit("updateSPMLLinkFile", {
      worksheetId: wsJunction?.worksheet_id,
      junctionId: wsJunction?.junction_id,
      linkFile: "",
    },
      async (response: SocketResponse) => {
        try {
          if (!response?.success) {
            openSnackbar(response?.message || "Failed to delete link file", "error");
            return;
          }
          await getWsSPMLJunctionKanwil(wsJunction.kppn_id ?? '');
          setLinkFile('');
          setIsEditing(false);
          openSnackbar("Link file deleted successfully", "success");
        } catch (err: unknown) {
          openSnackbar(err instanceof Error ? err.message : 'Unknown error', 'error');
        } finally {
          setIsLoading(false);
        }
      });
  };

  useEffect(() => {
    setLinkFile(wsJunction?.link_file || '');
    setIsEditing(false);
  }, [wsJunction, open]);

  const openLinkFileInNewTab = () => {
    const links = linkFile.split(/\s+/).filter(Boolean);

    if (links.length > 1) {
      openSnackbar("Link file invalid/terdapat lebih dari satu, silahkan buka secara manual", "error");
      return;
    }

    let url = links[0];

    if (!url) {
      openSnackbar("Link file kosong", "error");
      return;
    }

    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const hasLinkFile = Boolean(wsJunction?.link_file);

  return (
    <>
      <Popper
        open={open} anchorEl={anchorEl} placement={'top-start'} transition sx={{ zIndex: 9999 }}>
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={200}>
            <Paper sx={{ ...style, boxShadow: theme.customShadows.dialog }}>
              <ClickAwayListener onClickAway={handleClose}>
                <Box>
                  <Stack direction='column' spacing={1.5}>
                    <Typography variant='subtitle2' fontSize={13} textAlign={'left'}>
                      Link Bukti Dukung
                    </Typography>

                    {hasLinkFile && !isEditing ? (
                      <Stack direction='column' spacing={1}>
                        <Typography variant='body2' fontSize={11} color='text.secondary' sx={{ wordBreak: 'break-all' }}>
                          {linkFile}
                        </Typography>
                        <Stack direction='row' spacing={1} justifyContent='flex-start' alignItems='center'>
                          <Tooltip title="Buka link di tab baru">
                            <Button
                              aria-label="open-link"
                              variant='contained'
                              size='small'
                              color='primary'
                              onClick={openLinkFileInNewTab}
                              startIcon={<Iconify icon="solar:eye-bold" />}
                            >
                              Buka
                            </Button>
                          </Tooltip>

                          {!isPastDue && (
                            <>
                              <Tooltip title="Edit link">
                                <Button
                                  aria-label="edit-link"
                                  variant='contained'
                                  size='small'
                                  color='secondary'
                                  onClick={() => setIsEditing(true)}
                                  startIcon={<Iconify icon="solar:pen-bold" />}
                                >
                                  Edit
                                </Button>
                              </Tooltip>

                              <Tooltip title="Hapus link">
                                <Button
                                  aria-label="delete-link"
                                  variant='contained'
                                  size='small'
                                  color='error'
                                  onClick={handleDeleteLinkFile}
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
                      <Stack direction='column' spacing={1}>
                        <StyledFormControl>
                          <TextField
                            size='small'
                            value={linkFile}
                            onChange={(e) => setLinkFile(e.target.value)}
                            placeholder="Masukkan link bukti dukung..."
                            multiline
                            minRows={4}
                            maxRows={6}
                            fullWidth
                            inputProps={{ sx: { fontSize: 12, width: '100%', height: '100%' }, spellCheck: false }}
                            disabled={isPastDue}
                          />
                        </StyledFormControl>

                        {!isPastDue && (
                          <Stack direction='row' spacing={1} justifyContent='flex-end'>
                            {isEditing && (
                              <Button
                                size='small'
                                variant='text'
                                color='inherit'
                                onClick={() => {
                                  setLinkFile(wsJunction?.link_file || '');
                                  setIsEditing(false);
                                }}
                              >
                                Batal
                              </Button>
                            )}
                            <Button
                              size='small'
                              variant='contained'
                              color='primary'
                              onClick={handleEditLinkFile}
                            >
                              Simpan
                            </Button>
                          </Stack>
                        )}
                      </Stack>
                    )}
                  </Stack>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

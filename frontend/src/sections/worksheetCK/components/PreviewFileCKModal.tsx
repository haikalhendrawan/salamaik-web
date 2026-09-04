import { useCallback, useEffect } from 'react';
import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import Iconify from '../../../components/iconify';
import useSocket from '../../../hooks/useSocket';
import useSnackbar from '../../../hooks/display/useSnackbar';
import usePreviewFileCK from '../usePreviewFileCK';
import useWsCKJunction from '../useWsCKJunction';

export default function PreviewFileCKModal({ disabled }: { disabled: boolean }) {
  const { socket } = useSocket();
  const { openSnackbar } = useSnackbar();
  const { getWsCKJunction, lastLiveChange } = useWsCKJunction();
  const {
    open,
    fileName,
    worksheetId,
    junctionId,
    kppnId,
    closePreview,
  } = usePreviewFileCK();
  const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  const fileUrl = `${apiUrl}/worksheet/${fileName}`;
  const extension = fileName.split('.').pop()?.toLowerCase();

  const download = useCallback(() => {
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  }, [fileUrl]);

  const deleteFile = () => {
    if (disabled || !socket?.connected) return;
    socket.emit(
      'deleteWsCKJunctionFile',
      { worksheetId, junctionId, fileName },
      async (response: { success: boolean; message?: string }) => {
        if (!response?.success) {
          openSnackbar(response?.message || 'Gagal menghapus file CK', 'error');
          return;
        }
        await getWsCKJunction(kppnId, { showOverlay: false, refreshScore: false });
        closePreview();
        openSnackbar('File CK berhasil dihapus', 'success');
      }
    );
  };

  useEffect(() => {
    if (
      open &&
      lastLiveChange?.junctionId === junctionId &&
      lastLiveChange.changeType === 'file-delete'
    ) {
      closePreview();
    }
  }, [closePreview, junctionId, lastLiveChange, open]);

  const previewable = ['jpg', 'jpeg', 'png', 'pdf'].includes(extension || '');

  return (
    <Modal open={open} onClose={closePreview} keepMounted>
      <Box
        sx={{
          position: 'absolute',
          inset: '4vh 8vw',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 2,
        }}
      >
        <Stack direction="row" justifyContent="flex-end" spacing={1} mb={1}>
          <Button onClick={download} startIcon={<Iconify icon="solar:download-bold" />}>Download</Button>
          <Button
            color="error"
            variant="contained"
            onClick={deleteFile}
            disabled={disabled}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
            Hapus
          </Button>
          <Button color="inherit" onClick={closePreview}>Tutup</Button>
        </Stack>
        {previewable ? (
          <embed src={fileUrl} style={{ width: '100%', height: 'calc(92vh - 70px)', borderRadius: 8 }} />
        ) : (
          <Stack alignItems="center" justifyContent="center" height="70vh">
            <Typography>Preview tidak tersedia untuk tipe file ini.</Typography>
            <Button onClick={download}>Download file</Button>
          </Stack>
        )}
      </Box>
    </Modal>
  );
}

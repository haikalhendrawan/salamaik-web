import { ChangeEvent, useState } from 'react';
import { CircularProgress, Stack, Tooltip, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Iconify from '../../../../../components/iconify';
import StyledButton from '../../../../../components/styledButton/StyledButton';
import useAxiosJWT from '../../../../../hooks/useAxiosJWT';
import useSnackbar from '../../../../../hooks/display/useSnackbar';
import usePreviewFileCK from '../../../usePreviewFileCK';
import useWsCKJunction from '../../../useWsCKJunction';
import { WsCKJunctionType } from '../../../types';
import LinkFilePopoverCK from '../../LinkFilePopoverCK';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface FileActionsCKProps {
  checklist: WsCKJunctionType;
  disabled: boolean;
}

export default function FileActionsCK({ checklist, disabled }: FileActionsCKProps) {
  const theme = useTheme();
  const axiosJWT = useAxiosJWT();
  const { openSnackbar } = useSnackbar();
  const { openPreview } = usePreviewFileCK();
  const { getWsCKJunction, isJunctionSyncing } = useWsCKJunction();
  const [uploading, setUploading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const syncing = isJunctionSyncing(checklist.junction_id, ['file-upload', 'file-delete', 'link']);

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || disabled || checklist.file_1) return;

    const formData = new FormData();
    formData.append('worksheetId', checklist.worksheet_id);
    formData.append('junctionId', String(checklist.junction_id));
    formData.append('checklistCkId', String(checklist.checklist_ck_id));
    formData.append('kppnId', checklist.kppn_id);
    formData.append('wsCKJunctionFile', file);

    try {
      setUploading(true);
      await axiosJWT.post('/wsCKJunction/editWsCKJunctionFile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await getWsCKJunction(checklist.kppn_id, {
        showOverlay: false,
        refreshScore: false,
      });
      openSnackbar('File CK berhasil diunggah', 'success');
    } catch (error: unknown) {
      openSnackbar(error instanceof Error ? error.message : 'Gagal mengunggah file CK', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Typography variant="body2" fontSize="12px" sx={{ whiteSpace: 'pre-line' }}>
        {checklist.bukti_dukung || '-'}
      </Typography>
      <Stack direction="row" spacing={1} mt={1} alignItems="center">
        {checklist.file_1 && (
          <Tooltip title="Lihat file">
            <span>
              <StyledButton
                color="secondary"
                size="small"
                variant="contained"
                aria-label="Lihat dokumen dukung"
                disabled={syncing}
                onClick={() => openPreview({
                  fileName: checklist.file_1 || '',
                  worksheetId: checklist.worksheet_id,
                  junctionId: checklist.junction_id,
                  kppnId: checklist.kppn_id,
                })}
              >
                <Iconify icon="solar:file-bold-duotone" />
              </StyledButton>
            </span>
          </Tooltip>
        )}
        {!checklist.file_1 && (
          <Tooltip title={disabled ? 'Periode telah ditutup' : 'Upload file'}>
            <span>
              <StyledButton
                component="label"
                color="white"
                size="small"
                variant="contained"
                aria-label="Upload dokumen dukung"
                disabled={disabled || uploading || syncing}
              >
                {uploading
                  ? <CircularProgress size={18} color="inherit" />
                  : <Iconify color={theme.palette.grey[500]} icon="solar:add-circle-bold" />}
                <VisuallyHiddenInput
                  type="file"
                  accept="image/jpeg,image/png,.pdf,.zip,.rar"
                  onChange={upload}
                />
              </StyledButton>
            </span>
          </Tooltip>
        )}
        <Tooltip title={checklist.link_file ? 'Lihat atau edit link' : (disabled ? 'Periode telah ditutup' : 'Tambah link')}>
          <span>
            <StyledButton
              aria-label="Kelola link dokumen dukung"
              color={checklist.link_file ? 'primary' : 'white'}
              size="small"
              variant="contained"
              disabled={syncing || (disabled && !checklist.link_file)}
              onClick={(event) => setAnchorEl(event.currentTarget)}
            >
              <Iconify
                color={checklist.link_file ? theme.palette.common.white : theme.palette.grey[500]}
                icon="solar:link-bold-duotone"
              />
            </StyledButton>
          </span>
        </Tooltip>
      </Stack>
      <LinkFilePopoverCK
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        checklist={checklist}
        disabled={disabled}
      />
    </>
  );
}

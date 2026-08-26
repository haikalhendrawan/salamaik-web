import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Stack, Tooltip, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Iconify from '../../../../../components/iconify';
import StyledButton from '../../../../../components/styledButton/StyledButton';
import useAxiosJWT from '../../../../../hooks/useAxiosJWT';
import useLoading from '../../../../../hooks/display/useLoading';
import useSnackbar from '../../../../../hooks/display/useSnackbar';
import usePreviewFileModal from '../../../usePreviewFileModal';
import useWsSPMLJunction from '../../../useWsSPMLJunction';
import { WsSPMLJunctionType } from '../../../types';
import LinkFilePopover from '../../LinkFilePopover';

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

interface FileActionsProps {
  checklist: WsSPMLJunctionType;
}

export default function FileActions({ checklist }: FileActionsProps) {
  const theme = useTheme();
  const axiosJWT = useAxiosJWT();
  const { setIsLoading } = useLoading();
  const { openSnackbar } = useSnackbar();
  const { wsDetail, getWsSPMLJunctionKanwil } = useWsSPMLJunction();
  const { modalOpen, changeFile, selectId, handleSetIsExampleFile } = usePreviewFileModal();
  const [linkAnchor, setLinkAnchor] = useState<HTMLButtonElement | null>(null);

  const isPastDue = useMemo(
    () => new Date().getTime() > new Date(wsDetail?.close_period || '').getTime(),
    [wsDetail]
  );

  const handleOpenFile = useCallback(() => {
    if (!checklist.file_1) return;
    selectId(checklist.junction_id);
    changeFile(`worksheet/${checklist.file_1}`);
    handleSetIsExampleFile(false);
    modalOpen();
  }, [checklist, changeFile, handleSetIsExampleFile, modalOpen, selectId]);

  const handleChangeFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('worksheetId', checklist.worksheet_id);
      formData.append('junctionId', checklist.junction_id.toString());
      formData.append('checklistSpmlId', checklist.checklist_spml_id.toString());
      formData.append('kppnId', checklist.kppn_id ?? '');
      formData.append('wsSPMLJunctionFile', selectedFile);

      const response = await axiosJWT.post('/wsSPMLJunction/editWsSPMLJunctionFile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await getWsSPMLJunctionKanwil(checklist.kppn_id ?? '');
      openSnackbar(response.data?.message || 'File SPML berhasil diunggah', 'success');
    } catch (err: unknown) {
      const message = typeof err === 'object' && err !== null && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      openSnackbar(`Upload failed, ${message || (err instanceof Error ? err.message : 'Unknown error')}`, 'error');
    } finally {
      event.target.value = '';
      setIsLoading(false);
    }
  };

  return (
    <>
      <Typography variant="body2" fontSize="12px">{checklist.dokumen || '-'}</Typography>
      <Stack direction="row" spacing={1} mt={1}>
        {checklist.file_1 && (
          <Tooltip title="Lihat file">
            <span>
              <StyledButton color="secondary" size="small" variant="contained" onClick={handleOpenFile}>
                <Iconify icon="solar:file-bold-duotone" />
              </StyledButton>
            </span>
          </Tooltip>
        )}
        {!checklist.file_1 && (
          <Tooltip title="Upload file">
            <span>
              <StyledButton component="label" aria-label="Upload dokumen dukung" color="white" size="small" variant="contained" disabled={isPastDue}>
                <Iconify color={theme.palette.grey[500]} icon="solar:add-circle-bold" />
                <VisuallyHiddenInput type="file" accept="image/jpeg,image/png,.pdf,.zip,.rar" onChange={handleChangeFile} />
              </StyledButton>
            </span>
          </Tooltip>
        )}
        <Tooltip title={checklist.link_file ? 'Lihat atau edit link' : 'Tambah link'}>
          <span>
            <StyledButton aria-label="Kelola link dokumen dukung" color={checklist.link_file ? 'primary' : 'white'} size="small" variant="contained" onClick={(event) => setLinkAnchor(event.currentTarget)}>
              <Iconify color={checklist.link_file ? theme.palette.common.white : theme.palette.grey[500]} icon="solar:link-bold-duotone" />
            </StyledButton>
          </span>
        </Tooltip>
      </Stack>
      <LinkFilePopover open={Boolean(linkAnchor)} anchorEl={linkAnchor} handleClose={() => setLinkAnchor(null)} wsJunction={checklist} wsDetail={wsDetail} />
    </>
  );
}

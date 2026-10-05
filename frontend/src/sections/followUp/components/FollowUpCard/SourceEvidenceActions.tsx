import { ChangeEvent, useMemo, useState } from 'react';
import { Stack, Tooltip } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import StyledButton from '../../../../components/styledButton/StyledButton';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useLoading from '../../../../hooks/display/useLoading';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import { FindingsResponseType } from '../../types';
import { WsJunctionType } from '../../../worksheet/types';
import { WsCKJunctionType } from '../../../worksheetCK/types';
import { WsSPMLJunctionType } from '../../../worksheetSPML/types';
import { WorksheetType } from '../../../worksheet/types';
import usePreviewFileModal from '../../usePreviewFileModal';
import LinkFilePopoverPB from '../../../worksheet/component/LinkFilePopover';
import LinkFilePopoverCK from '../../../worksheetCK/components/LinkFilePopoverCK';
import LinkFilePopoverSPML from '../../../worksheetSPML/components/LinkFilePopover';

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

interface Props {
  finding: FindingsResponseType;
  disabled: boolean;
  getData: () => Promise<void>;
}

export default function SourceEvidenceActions({ finding, disabled, getData }: Props) {
  const theme = useTheme();
  const axiosJWT = useAxiosJWT();
  const { setIsLoading } = useLoading();
  const { openSnackbar } = useSnackbar();
  const preview = usePreviewFileModal();
  const [linkAnchor, setLinkAnchor] = useState<HTMLButtonElement | null>(null);
  const junction = finding.matrixDetail?.[0]?.ws_junction?.[0] as
    | (WsJunctionType & { file_1?: string | null; file_2?: string | null; file_3?: string | null; link_file?: string | null })
    | undefined;
  const worksheetType = finding.worksheet_type || 'PB';
  const maxFiles = worksheetType === 'PB' ? 3 : 1;
  const slots = useMemo(
    () => Array.from({ length: maxFiles }, (_, index) => ({
      slot: index + 1,
      file: junction?.[`file_${index + 1}` as 'file_1' | 'file_2' | 'file_3'] || null,
    })),
    [junction, maxFiles],
  );
  const firstEmptySlot = slots.find(({ file }) => !file)?.slot;

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || disabled || !firstEmptySlot) return;
    const formData = new FormData();
    formData.append('id', String(finding.id));
    formData.append('option', String(firstEmptySlot));
    formData.append('findingFile', file);
    setIsLoading(true);
    try {
      await axiosJWT.post('/updateFindingSourceFile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      await getData();
      openSnackbar('File bukti dukung berhasil ditambahkan', 'success');
    } catch (error: any) {
      openSnackbar(error?.response?.data?.message || 'Gagal menyimpan file bukti dukung', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const openFile = (slot: number, file: string) => {
    if (!junction) return;
    preview.setFileOption(slot);
    preview.selectId(junction.junction_id);
    preview.changeFile(`worksheet/${file}`);
    preview.handleSetIsExampleFile(false);
    preview.modalOpen();
  };

  const closeLinkPopover = () => {
    setLinkAnchor(null);
    void getData();
  };

  if (!junction) return null;
  const pbJunction = junction as WsJunctionType;
  const ckJunction = junction as unknown as WsCKJunctionType;
  const spmlJunction = junction as unknown as WsSPMLJunctionType;

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        {slots.filter(({ file }) => Boolean(file)).map(({ slot, file }) => (
          <Tooltip title="Lihat file" key={slot}>
            <span>
              <StyledButton
                color="secondary"
                size="small"
                variant="contained"
                aria-label={`Lihat file ${slot}`}
                onClick={() => openFile(slot, file as string)}
              >
                <Iconify icon="solar:file-bold-duotone" />
              </StyledButton>
            </span>
          </Tooltip>
        ))}
        {firstEmptySlot && (
          <Tooltip title="Upload file">
            <span>
              <StyledButton component="label" aria-label="Tambah file bukti dukung" color="white" size="small" variant="contained" disabled={disabled}>
                <Iconify color={theme.palette.grey[500]} icon="solar:add-circle-bold" />
                <VisuallyHiddenInput type="file" accept="image/jpeg,image/png,.pdf,.zip,.rar" onChange={upload} />
              </StyledButton>
            </span>
          </Tooltip>
        )}
        <Tooltip title={junction.link_file ? 'Lihat atau edit link' : 'Tambah link'}>
          <span>
            <StyledButton
              aria-label="Kelola link dokumen dukung"
              color={junction.link_file ? 'primary' : 'white'}
              size="small"
              variant="contained"
              disabled={disabled && !junction.link_file}
              onClick={(event) => setLinkAnchor(event.currentTarget)}
            >
              <Iconify color={junction.link_file ? theme.palette.common.white : theme.palette.grey[500]} icon="solar:link-bold-duotone" />
            </StyledButton>
          </span>
        </Tooltip>
      </Stack>

      {worksheetType === 'PB' && (
        <LinkFilePopoverPB
          open={Boolean(linkAnchor)}
          anchorEl={linkAnchor}
          handleClose={closeLinkPopover}
          wsJunction={pbJunction}
          wsDetail={(finding.worksheet as WorksheetType) || null}
          followUpFindingId={finding.id}
          followUpDisabled={disabled}
        />
      )}
      {worksheetType === 'CK' && (
        <LinkFilePopoverCK
          anchorEl={linkAnchor}
          onClose={closeLinkPopover}
          checklist={ckJunction}
          disabled={disabled}
          followUpFindingId={finding.id}
        />
      )}
      {worksheetType === 'SPML' && (
        <LinkFilePopoverSPML
          open={Boolean(linkAnchor)}
          anchorEl={linkAnchor}
          handleClose={closeLinkPopover}
          wsJunction={spmlJunction}
          isPastDue={disabled}
          followUpFindingId={finding.id}
        />
      )}
    </>
  );
}

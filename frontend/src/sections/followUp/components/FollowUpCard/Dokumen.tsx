/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { useCallback, useMemo, useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Skeleton  from "@mui/material/Skeleton";
import useTheme  from '@mui/material/styles/useTheme';
import styled  from '@mui/material/styles/styled';
import usePreviewFileModal from '../../usePreviewFileModal';
import Iconify from "../../../../components/iconify";
import StyledButton from "../../../../components/styledButton/StyledButton";
import useLoading from '../../../../hooks/display/useLoading';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import { WsJunctionType } from "../../../worksheet/types";
import useWsJunction from "../../../worksheet/useWsJunction";
import { FindingsResponseType } from '../../types';
import LinkFilePopoverPB from '../../../worksheet/component/LinkFilePopover';
import LinkFilePopoverCK from '../../../worksheetCK/components/LinkFilePopoverCK';
import LinkFilePopoverSPML from '../../../worksheetSPML/components/LinkFilePopover';
import { WsCKJunctionType } from '../../../worksheetCK/types';
import { WsSPMLJunctionType } from '../../../worksheetSPML/types';
// ----------------------------------------------------------------------------
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

interface DokumenProps{
  openInstruction: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  findingResponse: FindingsResponseType | null,
  getData: () => Promise<void>,
  isDisabled: boolean
}

// ----------------------------------------------------------------------------
export default function Dokumen({openInstruction, findingResponse, getData, isDisabled}: DokumenProps){
  const [isMounted, setIsMounted] = useState(true);
  const [linkAnchor, setLinkAnchor] = useState<HTMLButtonElement | null>(null);

  const theme = useTheme();

  const { handleSetIsExampleFile, modalOpen, changeFile, selectId, setFileOption } = usePreviewFileModal();

  const {getWsJunctionKanwil} = useWsJunction();

  const wsJunction = findingResponse?.matrixDetail[0]?.ws_junction[0] || null;

  const axiosJWT = useAxiosJWT();

  const {setIsLoading} = useLoading();

  const {openSnackbar} = useSnackbar();

  const handleOpenExampleFile = useCallback((option: number) => {
    const baseDir = "checklist";
    const fileOption = option===1?wsJunction?.file1:wsJunction?.file2;
    modalOpen();
    changeFile(baseDir+ '/' + fileOption || '');
    handleSetIsExampleFile(true);
  }, [modalOpen, wsJunction]);

  const handleOpenWsJunctionFile = useCallback((option: number) => {
    const baseDir = "worksheet";
    const fileOption = [wsJunction?.file_1, wsJunction?.file_2, wsJunction?.file_3][option-1];
    setFileOption(option);
    modalOpen();
    changeFile(baseDir+ '/' + fileOption || '');
    handleSetIsExampleFile(false);
    selectId(wsJunction?.junction_id || 0);
  }, [modalOpen, wsJunction]);

  const handleChangeFile = async(e: React.ChangeEvent<HTMLInputElement>, wsJunction: WsJunctionType | null) => {
    e.preventDefault();
    if(!e.target.files){
      return
    };

    if(!wsJunction) {
      return
    };

    const selectedFile = e.target.files[0];
    const option = (!wsJunction?.file_1) ? 1 : (!wsJunction?.file_2) ? 2 : 3;

    const checklistId = wsJunction?.checklist_id.toString();
    const kppnId = wsJunction?.kppn_id.toString();
    const worksheetId = wsJunction?.worksheet_id;

    try{
      setIsLoading(true);
      const formData = new FormData();
      formData.append("worksheetId", worksheetId);
      formData.append("junctionId", wsJunction?.junction_id.toString());
      formData.append("checklistId", checklistId);
      formData.append("kppnId", kppnId);
      formData.append("option", option.toString());
      formData.append("wsJunctionFile", selectedFile);
      await axiosJWT.post(`/editWsJunctionFile`, formData, {
        headers:{"Content-Type": "multipart/form-data"}
      });
      await getWsJunctionKanwil(kppnId);
      await getData();
      setIsLoading(false); 
    }catch(err: any){
      setIsLoading(false);
      openSnackbar(`Upload failed, ${err?.response?.data?.message}`, "error");
    }finally{
      setIsLoading(false);
    }
  };

  const isMaxFile = useMemo(() => {
    return wsJunction?.file_1 && wsJunction?.file_2 && wsJunction?.file_3;
  }, [wsJunction]);

  const isRegulation2Finding = findingResponse?.matrix_id == null && Boolean(findingResponse?.worksheet_type);

  const handleChangeRegulation2File = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !wsJunction || !findingResponse || isDisabled) return;

    const formData = new FormData();
    formData.append('worksheetId', wsJunction.worksheet_id);
    formData.append('junctionId', String(wsJunction.junction_id));
    formData.append('kppnId', String(wsJunction.kppn_id));
    let endpoint: string;

    if (findingResponse.worksheet_type === 'CK') {
      const checklistCkId = (wsJunction as unknown as { checklist_ck_id?: number }).checklist_ck_id;
      if (!checklistCkId) return;
      formData.append('checklistCkId', String(checklistCkId));
      formData.append('wsCKJunctionFile', file);
      endpoint = '/wsCKJunction/editWsCKJunctionFile';
    } else if (findingResponse.worksheet_type === 'SPML') {
      const checklistSpmlId = (wsJunction as unknown as { checklist_spml_id?: number }).checklist_spml_id;
      if (!checklistSpmlId) return;
      formData.append('checklistSpmlId', String(checklistSpmlId));
      formData.append('wsSPMLJunctionFile', file);
      endpoint = '/wsSPMLJunction/editWsSPMLJunctionFile';
    } else {
      const fileCount = [wsJunction.file_1, wsJunction.file_2, wsJunction.file_3].filter(Boolean).length;
      if (fileCount >= 3) return;
      formData.append('checklistId', String(wsJunction.checklist_id));
      formData.append('option', String(fileCount + 1));
      formData.append('wsJunctionFile', file);
      endpoint = '/editWsJunctionFile';
    }

    try {
      setIsLoading(true);
      await axiosJWT.post(endpoint, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      await getData();
    } catch (err: any) {
      openSnackbar(err?.response?.data?.message || 'Gagal mengunggah bukti dukung', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const closeSourceLinkPopover = () => {
    setLinkAnchor(null);
    void getData();
  };

  useEffect(() => {
    setIsMounted(false);
  }, []);

  if(isMounted) {
    return (
      <>
        <Skeleton variant="rounded" height={'3em'} width={'50%'} />
        <br/>
        <br/>
        <Skeleton variant="rounded" height={'3em'} width={'50%'} />
      </>
    )
  }

  if (isRegulation2Finding) {
    const sourceFiles = [wsJunction?.file_1, wsJunction?.file_2, wsJunction?.file_3].filter(Boolean) as string[];
    const maxFiles = findingResponse?.worksheet_type === 'PB' ? 3 : 1;
    const canAddFile = sourceFiles.length < maxFiles;
    const ckJunction = wsJunction as unknown as WsCKJunctionType;
    const spmlJunction = wsJunction as unknown as WsSPMLJunctionType;

    return (
      <Stack direction="column" spacing={1}>
        <Stack spacing={1}>
          <Typography variant="body3" fontSize={12} textAlign="left">Bukti Dukung :</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {sourceFiles.map((file, index) => (
              <Tooltip title={`Buka file ${index + 1}`} key={file}>
                <span>
                  <StyledButton aria-label={`Buka file ${index + 1}`} variant="contained" size="small" color="secondary" onClick={() => window.open(`${import.meta.env.VITE_API_URL}/worksheet/${file}`, '_blank', 'noopener,noreferrer')}>
                    <Iconify icon="solar:file-bold-duotone" />
                  </StyledButton>
                </span>
              </Tooltip>
            ))}
            {canAddFile && (
            <Tooltip title="Tambah file">
              <span>
                <StyledButton component="label" aria-label="Tambah file" variant="contained" size="small" color="white" disabled={isDisabled}>
                  <Iconify color={theme.palette.grey[500]} icon="solar:add-circle-bold" />
                  <VisuallyHiddenInput type="file" accept="image/*,.pdf,.zip" onChange={handleChangeRegulation2File} disabled={isDisabled} />
                </StyledButton>
              </span>
            </Tooltip>
            )}
            <Tooltip title={wsJunction?.link_file ? 'Lihat atau edit link' : 'Tambah link'}>
              <span>
                <StyledButton aria-label="Kelola link bukti dukung" variant="contained" size="small" color={wsJunction?.link_file ? 'primary' : 'white'} disabled={isDisabled && !wsJunction?.link_file} onClick={(event) => setLinkAnchor(event.currentTarget)}>
                  <Iconify color={wsJunction?.link_file ? theme.palette.common.white : theme.palette.grey[500]} icon="solar:link-bold-duotone" />
                </StyledButton>
              </span>
            </Tooltip>
          </Stack>
          {findingResponse?.worksheet_type === 'PB' && (
            <LinkFilePopoverPB open={Boolean(linkAnchor)} anchorEl={linkAnchor} handleClose={closeSourceLinkPopover} wsJunction={wsJunction} wsDetail={findingResponse.worksheet || null} />
          )}
          {findingResponse?.worksheet_type === 'CK' && (
            <LinkFilePopoverCK anchorEl={linkAnchor} onClose={closeSourceLinkPopover} checklist={ckJunction} disabled={isDisabled} />
          )}
          {findingResponse?.worksheet_type === 'SPML' && (
            <LinkFilePopoverSPML open={Boolean(linkAnchor)} anchorEl={linkAnchor} handleClose={closeSourceLinkPopover} wsJunction={spmlJunction} isPastDue={isDisabled} />
          )}
        </Stack>
      </Stack>
    );
  }

  return(
    <>
      <Stack direction='column' spacing={2}>
        <Stack direction='column' spacing={1}>
          <Typography variant='body3' fontSize={12} textAlign={'left'}>Petunjuk :</Typography>
          <Stack direction='row' spacing={1}>
            <Tooltip title='Instruksi'>
              <span>
                <StyledButton 
                  aria-label="instruksi" 
                  variant='contained' 
                  size='small' 
                  color='white' 
                  onClick={(e) => openInstruction(e)}
                >
                  <Iconify color={theme.palette.grey[500]} icon="solar:info-circle-bold"/>
                </StyledButton>
              </span>
            </Tooltip>
            {
              wsJunction?.file1
              ?
                <Tooltip title='Contoh Bukti Dukung 1'>
                  <span>
                    <StyledButton 
                      aria-label="edit" 
                      variant='contained' 
                      size='small' 
                      color='warning'
                      onClick={() => handleOpenExampleFile(1)}
                    >
                      <Iconify icon="solar:file-bold-duotone"/>
                    </StyledButton>
                  </span>
                </Tooltip>
              :
                null
            }
            {
              wsJunction?.file2
              ?
                <Tooltip title='Contoh Bukti Dukung 2'>
                  <span>
                    <StyledButton 
                      aria-label="edit" 
                      variant='contained' 
                      size='small' 
                      color='warning'
                      onClick={() => handleOpenExampleFile(2)}
                    >
                      <Iconify icon="solar:file-bold-duotone"/>
                    </StyledButton>
                  </span>
                </Tooltip>
              :
                null
            } 
          </Stack>
        </Stack>

        <Stack direction='column' spacing={1}>
          <Typography variant='body3' fontSize={12} textAlign={'left'}>Bukti Dukung :</Typography>
          <Stack direction='row' spacing={1}>
            {
              wsJunction?.file_1
              ?
                <Tooltip title='file 1'>
                  <span>
                    <StyledButton 
                      aria-label="edit" 
                      variant='contained' 
                      size='small' 
                      color='secondary'
                      onClick={() => handleOpenWsJunctionFile(1)}
                    >
                      <Iconify icon="solar:file-bold-duotone"/>
                    </StyledButton>
                  </span>
                </Tooltip>
              :
                null
            }
            {
              wsJunction?.file_2
              ?
                <Tooltip title='file 2'>
                  <span>
                    <StyledButton 
                      aria-label="edit" 
                      variant='contained' 
                      size='small' 
                      color='secondary'
                      onClick={() => handleOpenWsJunctionFile(2)}
                    >
                      <Iconify icon="solar:file-bold-duotone"/>
                    </StyledButton>
                  </span>
                </Tooltip>
              :
                null
            }
            {
              wsJunction?.file_3
              ?
                <Tooltip title='file 3'>
                  <span>
                    <StyledButton 
                      aria-label="edit" 
                      variant='contained' 
                      size='small' 
                      color='secondary'
                      onClick={() => handleOpenWsJunctionFile(3)}
                    >
                      <Iconify icon="solar:file-bold-duotone"/>
                    </StyledButton>
                  </span>
                </Tooltip>
              :
                null
            }
            {
              !isMaxFile
              ?
                <Tooltip title='Add file'>
                  <StyledButton variant='contained' component='label' aria-label="delete" size='small' color='white' disabled={isDisabled}>
                    <Iconify 
                      icon="solar:add-circle-bold"
                      color={theme.palette.grey[500]}
                    />
                    <VisuallyHiddenInput 
                      type='file'
                      accept='image/*,.pdf,.zip' 
                      onChange={(e) => handleChangeFile(e, wsJunction)} 
                      disabled={isDisabled}
                    />
                  </StyledButton>
                </Tooltip>
              :
                null
            }
           
          </Stack>
        </Stack>
      </Stack>   
    </>
  )
}

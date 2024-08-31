import React, {useMemo, useState} from 'react';
import { Typography, Table, Card, TableContainer, Grow, TableBody, TableRow, TableCell, Button, Tooltip} from '@mui/material';
import {useAuth} from '../../../../hooks/useAuth';
import { useTheme, styled} from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import Label from '../../../../components/label';
import MatrixTableToolbar from './MatrixTableToolbar';
import MatrixTableHead from './MatrixTableHead';
import MatrixTableEditModal from './MatrixTableEditModal';
import Iconify from '../../../../components/iconify/Iconify';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import { MatrixWithWsJunctionType } from '../../types';
import useDictionary from '../../../../hooks/useDictionary';
import StyledButton from '../../../../components/styledButton';
import useLoading from '../../../../hooks/display/useLoading';
import useDialog from '../../../../hooks/display/useDialog';
// ----------------------------------------------------------------------------------
const StyledTableCell = styled(TableCell)(({  }) => ({
  fontSize: '12px'
}));

// ----------------------------------------------------------------------------------
export default function MatrixTable({matrix, matrixStatus, getMatrix, worksheetId}: {
  matrix: MatrixWithWsJunctionType[] | [], 
  matrixStatus: number | null, 
  getMatrix: () => Promise<void>,
  worksheetId: string | null}) {
  const theme = useTheme();

  const [selectedKomponen, setSelectedKomponen] = useState<string | null>('1');

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [open, setOpen] = useState<boolean>(false);

  const {auth} = useAuth();

  const axiosJWT = useAxiosJWT();
  
  const {setIsLoading} = useLoading();

  const {openSnackbar} = useSnackbar();

  const {openDialog} = useDialog();

  const kppnId = new URLSearchParams(useLocation().search).get("id");

  const {subKomponenRef} = useDictionary();

  const isAdminKanwil = auth?.role === 4 || auth?.role === 99;

  const isUserKanwil = auth?.role === 3;

  const selectedMatrix = useMemo(() => {
    if(selectedId){
      return matrix?.find((matrix) => matrix?.id === selectedId) || null
    };

    return null
  }, [matrix, selectedId]);

  const handleAssignMatrix = async() => {
    try{
      setIsLoading(true);
      await axiosJWT.post(`/createMatrix`, {kppnId});
      await getMatrix();
      setIsLoading(false);
    }catch(err: any){
      setIsLoading(false);
      if(err.response){
        openSnackbar(err.response.data.message, "error");
      }else{
        openSnackbar('network error', "error");
      }
    }finally{
      setIsLoading(false);
    }
  };

  const handleClickAassign = () => {
    openDialog(
      'Assign Matriks',
      'Assign matriks? pastikan seluruh checklist kertas kerja telah diisi',
      'pink',
      'Ya',
      () => handleAssignMatrix()
    )
  };

  const handleClickReassign = () => {
    openDialog(
      'Reassign Matriks',
      'Re-assign matriks?',
      'warning',
      'Ya',
      () => handleReAssignMatrix()
    )
  };

  const handleClickDelete = () => {
    openDialog(
      'Delete Matriks',
      'Hapus matriks? seluruh catatan yang diisi akan terhapus',
      'pink',
      'Ya',
      () => handleDeleteMatrix()
    )
  }

  const handleDeleteMatrix = async() => {
    try{
      await axiosJWT.post(`/deleteMatrix`, {worksheetId:worksheetId});
      getMatrix();
    }catch(err: any){
      openSnackbar(err?.response?.data?.message, "error");
    }
  };

  const handleReAssignMatrix = async() => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.post(`/reAssignMatrix`, {kppnId: kppnId});
      await getMatrix();
      openSnackbar(response.data.message, "success");
      setIsLoading(false);
    }catch(err: any){
      setIsLoading(false);
      if(err.response){
        openSnackbar(err.response.data.message, "error");
      }else{
        openSnackbar('network error', "error");
      }
    }finally{
      setIsLoading(false);
    }
  };

  const handleOpen = (id: number) => { // for edit modal
    setOpen(true);
    setSelectedId(id);
  };

  const handleClose = () => { // for edit modal
    setOpen(false);
    setSelectedId(null);
  };

  const tableContentNoMatrix =  (
    <TableRow hover key={0} tabIndex={-1}>
      <TableCell colSpan={10} height={'480px'} align='center'>
        <Button variant='contained' endIcon={ <Iconify icon="solar:plain-bold-duotone"/>} onClick={handleClickAassign}>
          Assign Matrix
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <MatrixTableToolbar 
        matrixStatus={matrixStatus} 
        selectedKomponen={selectedKomponen} 
        setSelectedKomponen={setSelectedKomponen} 
        getMatrix={getMatrix}
        matrix={matrix}
      />
      
      <Grow in>
        <Card sx={{height:'auto', display:'flex', flexDirection:'column', gap:theme.spacing(1), mb: 1}}>
          <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <MatrixTableHead />
            <TableBody>
              {
                (matrixStatus === 0 && isAdminKanwil)? tableContentNoMatrix : null
              }
              {
                matrix.length === 0 
                ? null
                :subKomponenRef?.map((sub, index) => {
                  const sectionedMatrix = matrix?.filter((item) => item.checklist[0]?.subkomponen_id === sub?.id) || [];
                  const spannedRow = (
                    <React.Fragment key={index}>
                      <StyledTableCell align="center" rowSpan={sectionedMatrix?.length} sx={{verticalAlign:'top'}}>{sub?.id}</StyledTableCell>

                      <StyledTableCell align="left" rowSpan={sectionedMatrix?.length} sx={{verticalAlign:'top'}}>
                        <Typography variant='body2' fontWeight={'bold'} fontSize={'12px'}>Komponen {sectionedMatrix[0]?.komponen_string}</Typography>
                        <Typography variant='body2' fontSize={'12px'}>Subkomponen {sub?.title}</Typography>
                      </StyledTableCell>
                    </React.Fragment>
                  )

                  return sectionedMatrix?.filter((mtx) => mtx.checklist[0]?.komponen_id === Number(selectedKomponen))?.map((item, i) => {
                    const findingStatus = item?.findings?.[0]?.status;
                    const isFinding = item?.is_finding===1;

                    const statusLabels: Record<number, { color: string; text: string }> = {
                      3: { color: 'success', text: 'Disetujui' },
                      2: { color: 'error', text: 'Ditolak' },
                      1: { color: 'warning', text: 'Proses' },
                      0: { color: 'error', text: 'Perlu tindak lanjut' }
                    };
                    
                    const currentStatus = statusLabels[findingStatus];

                    return (
                      <>
                        <TableRow hover key={i+1} tabIndex={-1} >
                        
                          {i===0?spannedRow: null}
  
                          <StyledTableCell align="left" sx={{backgroundColor: isFinding?theme.palette.warning.main:null}}>{item?.hasil_implementasi}</StyledTableCell>
  
                          <StyledTableCell align="left">{item?.permasalahan}</StyledTableCell>
  
                          <StyledTableCell align="left">{item?.rekomendasi}</StyledTableCell>
  
                          <StyledTableCell align="left">{item?.peraturan}</StyledTableCell>
  
                          <StyledTableCell align="left">{item?.uic}</StyledTableCell>
  
                          <StyledTableCell align="left">{item?.tindak_lanjut}</StyledTableCell>
  
                          <StyledTableCell align="left">
                            {currentStatus && (
                              <Label color={currentStatus.color}>
                                {currentStatus.text}
                              </Label>
                            )}
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            <Tooltip title="Edit matriks">
                              <StyledButton variant='contained' color='warning' onClick={() => handleOpen(item?.id)} disabled={!isUserKanwil && !isAdminKanwil}>
                                  <Iconify icon="mdi:edit" />
                                </StyledButton>
                            </Tooltip>
                          </StyledTableCell>
                        </TableRow>
                      </>
                    )
                  })

                  
                })
              }
            </TableBody>
          </Table>
          </TableContainer>
        </Card>
      </Grow>
      {
          matrixStatus === 1 && (isAdminKanwil || isUserKanwil)
          ? <Button 
              variant='contained' 
              color='warning' 
              endIcon={ <Iconify icon="solar:plain-bold-duotone"/>} 
              onClick={handleClickReassign}
              sx={{mr:2}}>
              ReAssign Matrix
            </Button> 
          : null
      }
      {
          matrixStatus === 1 && (isAdminKanwil)
          ? <Button 
              variant='contained' 
              endIcon={ <Iconify icon="solar:trash-bin-trash-bold-duotone"/>} 
              onClick={handleClickDelete}
            >
              Delete
            </Button> 
          : null
      }

      <MatrixTableEditModal 
        modalOpen={open} 
        modalClose={handleClose} 
        matrix={selectedMatrix} 
        getMatrix={getMatrix}
      />
    </>
  )


}
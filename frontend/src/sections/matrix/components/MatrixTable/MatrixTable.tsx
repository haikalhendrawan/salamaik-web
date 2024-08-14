import React, {useMemo, useEffect, useState} from 'react';
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
import { MatrixType, MatrixWithWsJunctionType } from '../../types';
import { WorksheetType } from '../../../worksheet/types';
import useDictionary from '../../../../hooks/useDictionary';
import StyledButton from '../../../../components/styledButton';
import useLoading from '../../../../hooks/display/useLoading';
// ----------------------------------------------------------------------------------
interface MatrixResponse{
  worksheet: WorksheetType,
  matrix: MatrixWithWsJunctionType[]
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '12px'
}));

// ----------------------------------------------------------------------------------
export default function MatrixTable({matrix, matrixStatus, getMatrix}: {matrix: MatrixWithWsJunctionType[] | [], matrixStatus: number | null, getMatrix: () => Promise<void>}) {
  const theme = useTheme();

  const [selectedKomponen, setSelectedKomponen] = useState<string | null>('1');

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [open, setOpen] = useState<boolean>(false);

  const {auth} = useAuth();

  const axiosJWT = useAxiosJWT();
  
  const {setIsLoading} = useLoading();

  const {openSnackbar} = useSnackbar();

  const kppnId = new URLSearchParams(useLocation().search).get("id");

  const {subKomponenRef} = useDictionary();

  const selectedMatrix = useMemo(() => {
    if(selectedId){
      return matrix?.find((matrix) => matrix?.id === selectedId) || null
    };

    return null
  }, [matrix, selectedId]);

  const handleAssignMatrix = async() => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.post(`/createMatrix`, {kppnId});
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

  const handleDeleteMatrix = async() => {
    try{
      const response = await axiosJWT.post(`/deleteMatrix`, {worksheetId:'6d77aea7-4976-47d7-8ed7-46f25463ba5d'});
      getMatrix();
    }catch(err){
      console.log(err);
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
        <Button variant='contained' endIcon={ <Iconify icon="solar:plain-bold-duotone"/>} onClick={handleAssignMatrix}>
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
                matrixStatus === 0 ? tableContentNoMatrix : null
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
                            {findingStatus === 1
                              ?(<Label color={'success'}> selesai</Label>)
                              :findingStatus === 0
                                ?(<Label color={'error'}> Perlu tindak lanjut </Label>)
                                : null
                            }
                          </StyledTableCell>

                          <StyledTableCell align="left">
                            <Tooltip title="Edit matriks">
                              <StyledButton variant='contained' color='warning' onClick={() => handleOpen(item?.id)}>
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
      
      <Button onClick={handleDeleteMatrix}>Delete</Button>

      <MatrixTableEditModal modalOpen={open} modalClose={handleClose} matrix={selectedMatrix} getMatrix={getMatrix}/>
    </>
  )


}
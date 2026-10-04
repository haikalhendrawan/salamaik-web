/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Iconify from '../../components/iconify/Iconify';
import {Button, Container, Stack, Typography} from '@mui/material';
// sections
import MatrixTable from './components/MatrixTable/MatrixTable';
import MatrixDetailHeader from './components/MatrixDetailHeader';
import useLoading from '../../hooks/display/useLoading';
import useSnackbar from '../../hooks/display/useSnackbar';
import useAxiosJWT from '../../hooks/useAxiosJWT';
import { MatrixWithWsJunctionType, Regulation2MatrixRow } from './types';
import { WorksheetType } from '../worksheet/types';
import { useAuth } from '../../hooks/useAuth';
import useDictionary from '../../hooks/useDictionary';
import MatrixTablePeraturan2 from './components/MatrixTablePeraturan2';
import useDialog from '../../hooks/display/useDialog';
// ----------------------------------------------------------------------------------
interface MatrixResponse{
  worksheet: WorksheetType,
  matrix: MatrixWithWsJunctionType[]
};
// ----------------------------------------------------------------------------------
export default function MatrixDetail() {
  const navigate = useNavigate();
  
  const axiosJWT = useAxiosJWT();
  const { auth } = useAuth();
  const { kppnRef, periodRef } = useDictionary();

  const {openSnackbar} = useSnackbar();

  const {setIsLoading} = useLoading();
  const {openDialog} = useDialog();

  const kppnId = new URLSearchParams(useLocation().search).get("id");

  const [matrixStatus, setMatrixStatus] = useState<number | null>(null);

  const [worksheetId, setWorksheetId] = useState<string | null>(null);

  const [worksheetDetail, setWorksheetDetail] = useState<WorksheetType | null>(null);

  const [matrix, setMatrix] = useState<MatrixWithWsJunctionType[] | []>([]);
  const [matrixPeraturan2, setMatrixPeraturan2] = useState<Regulation2MatrixRow[]>([]);
  const canPostOrSyncFindings = Boolean(
    worksheetDetail &&
    Date.now() >= new Date(worksheetDetail.open_period).getTime() &&
    Date.now() < new Date(worksheetDetail.open_follow_up).getTime()
  );
  const canEditPeraturan2Matrix = Boolean(
    worksheetDetail &&
    [3, 4, 99].includes(auth?.role || 0) &&
    Date.now() <= new Date(worksheetDetail.close_follow_up).getTime()
  );

  const handlePostRegulation2 = () => {
      openDialog(
        matrixStatus === 1 ? 'Sinkronisasi Temuan' : 'Posting Temuan',
        matrixStatus === 1
          ? 'Perubahan checklist yang memenuhi kriteria temuan akan disinkronkan. Temuan yang tidak lagi memenuhi kriteria akan dihapus selama periode tindak lanjut belum dimulai.'
          : 'Temuan worksheet PB, CK, dan SPML akan disalin ke menu Tindak Lanjut. Anda dapat menyinkronkannya kembali sampai periode tindak lanjut dimulai.',
        'warning',
        matrixStatus === 1 ? 'Sinkronkan' : 'Posting',
        async () => {
      try {
        setIsLoading(true);
        await axiosJWT.post('/createMatrix', { kppnId });
        await getMatrix();
        openSnackbar(matrixStatus === 1 ? 'Temuan berhasil disinkronkan' : 'Temuan berhasil diposting', 'success');
      } catch (err: any) {
        openSnackbar(err?.response?.data?.message || 'Gagal memposting temuan', 'error');
      } finally {
        setIsLoading(false);
      }
        }
      );
  };

  const getMatrix = async() => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.get(auth?.peraturan === 2
        ? `/matrix/peraturan-2/${kppnId}/${auth?.period}`
        : `/getMatrixWithWsDetailById/${kppnId}`);
      const matrixResponse: MatrixResponse = response.data.rows;
      setMatrixStatus(matrixResponse.worksheet.matrix_status);
      setWorksheetId(matrixResponse.worksheet.id);
      setWorksheetDetail(matrixResponse.worksheet);
      if (auth?.peraturan === 2) setMatrixPeraturan2(matrixResponse.matrix as unknown as Regulation2MatrixRow[]);
      else setMatrix(matrixResponse.matrix);
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

  useEffect(() => {
    getMatrix();
  }, []);

  return (
    <>
    <Container maxWidth="xl">
      <Button variant="contained" color='white' onClick={() =>  navigate(-1)}>
        <Iconify icon={"eva:arrow-ios-back-outline"} />
        Back
      </Button>

      <MatrixDetailHeader />
      {auth?.peraturan === 2 ? (
        <>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {canPostOrSyncFindings
                ? 'Temuan dapat diposting atau disinkronkan sebelum periode tindak lanjut dimulai.'
                : 'Posting dan sinkronisasi temuan hanya tersedia setelah periode pengisian dibuka dan sebelum tindak lanjut dimulai.'}
            </Typography>
            {canPostOrSyncFindings && (auth?.role === 4 || auth?.role === 99) && (
              <Button variant="contained" color="warning" onClick={handlePostRegulation2}>
                {matrixStatus === 1 ? 'Sinkronisasi Temuan' : 'Posting Temuan'}
              </Button>
            )}
          </Stack>
          <MatrixTablePeraturan2
            rows={matrixPeraturan2}
            kppnName={kppnRef?.list?.find((item) => item.id === kppnId)?.alias || ''}
            periodName={periodRef?.list?.find((item) => item.id === auth?.period)?.name || ''}
            getMatrix={getMatrix}
            canEdit={canEditPeraturan2Matrix}
          />
        </>
      ) : !matrix
        ? null 
        :<MatrixTable matrix={matrix} matrixStatus={matrixStatus} getMatrix={getMatrix} worksheetId={worksheetId} worksheetDetail={worksheetDetail}/>
      }
     
    </Container>
    </>
  )

}

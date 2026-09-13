/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Iconify from '../../components/iconify/Iconify';
import {Button, Container} from '@mui/material';
// sections
import MatrixTable from './components/MatrixTable/MatrixTable';
import MatrixDetailHeader from './components/MatrixDetailHeader';
import useLoading from '../../hooks/display/useLoading';
import useSnackbar from '../../hooks/display/useSnackbar';
import useAxiosJWT from '../../hooks/useAxiosJWT';
import { MatrixWithWsJunctionType, Regulation2MatrixRow } from './types';
import { WorksheetType } from '../worksheet/types';
import { DialogProvider } from '../../hooks/display/useDialog';
import { useAuth } from '../../hooks/useAuth';
import useDictionary from '../../hooks/useDictionary';
import MatrixTablePeraturan2 from './components/MatrixTablePeraturan2';
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

  const kppnId = new URLSearchParams(useLocation().search).get("id");

  const [matrixStatus, setMatrixStatus] = useState<number | null>(null);

  const [worksheetId, setWorksheetId] = useState<string | null>(null);

  const [worksheetDetail, setWorksheetDetail] = useState<WorksheetType | null>(null);

  const [matrix, setMatrix] = useState<MatrixWithWsJunctionType[] | []>([]);
  const [matrixPeraturan2, setMatrixPeraturan2] = useState<Regulation2MatrixRow[]>([]);

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
        <MatrixTablePeraturan2
          rows={matrixPeraturan2}
          kppnName={kppnRef?.list?.find((item) => item.id === kppnId)?.alias || ''}
          periodName={periodRef?.list?.find((item) => item.id === auth?.period)?.name || ''}
        />
      ) : !matrix
        ? null 
        :<DialogProvider>
            <MatrixTable matrix={matrix} matrixStatus={matrixStatus} getMatrix={getMatrix} worksheetId={worksheetId} worksheetDetail={worksheetDetail}/>
          </DialogProvider>
      }
     
    </Container>
    </>
  )

}

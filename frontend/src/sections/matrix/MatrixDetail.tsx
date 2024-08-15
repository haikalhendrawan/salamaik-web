import {useMemo, useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Iconify from '../../components/iconify/Iconify';
import {useTheme} from '@mui/material/styles';
import {Button, Container} from '@mui/material';
// sections
import MatrixTable from './components/MatrixTable/MatrixTable';
import MatrixDetailHeader from './components/MatrixDetailHeader';
import useLoading from '../../hooks/display/useLoading';
import useSnackbar from '../../hooks/display/useSnackbar';
import useAxiosJWT from '../../hooks/useAxiosJWT';
import { MatrixType, MatrixWithWsJunctionType } from './types';
import { WorksheetType } from '../worksheet/types';
import { DialogProvider } from '../../hooks/display/useDialog';
// ----------------------------------------------------------------------------------
interface MatrixResponse{
  worksheet: WorksheetType,
  matrix: MatrixWithWsJunctionType[]
};
// ----------------------------------------------------------------------------------
export default function MatrixDetail() {
  const theme = useTheme();

  const navigate = useNavigate();
  
  const axiosJWT = useAxiosJWT();

  const {openSnackbar} = useSnackbar();

  const {setIsLoading} = useLoading();

  const kppnId = new URLSearchParams(useLocation().search).get("id");

  const [matrixStatus, setMatrixStatus] = useState<number | null>(null);

  const [matrix, setMatrix] = useState<MatrixWithWsJunctionType[] | []>([]);

  const getMatrix = async() => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.get(`/getMatrixWithWsDetailById/${kppnId}`);
      const matrixResponse: MatrixResponse = response.data.rows;
      setMatrixStatus(matrixResponse.worksheet.matrix_status);
      setMatrix(matrixResponse.matrix);
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
      {!matrix
        ? null 
        :<DialogProvider>
            <MatrixTable matrix={matrix} matrixStatus={matrixStatus} getMatrix={getMatrix}/>
          </DialogProvider>
      }
     
    </Container>
    </>
  )

}
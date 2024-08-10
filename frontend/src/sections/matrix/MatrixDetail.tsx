import { useNavigate } from 'react-router-dom';
import Iconify from '../../components/iconify/Iconify';
// @mui
import {useTheme} from '@mui/material/styles';
import {Button, Container} from '@mui/material';
// sections
import MatrixTable from './components/MatrixTable';

export default function MatrixDetail() {
  const theme = useTheme();

  const navigate = useNavigate();

  return (
    <>
    <Container maxWidth="xl">
      <Button variant="contained" color='white' onClick={() =>  navigate(-1)}>
        <Iconify icon={"eva:arrow-ios-back-outline"} />
        Back
      </Button> 

      <MatrixTable />
    </Container>
    </>
  )

}
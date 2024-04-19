import { useNavigate } from 'react-router-dom';
import Iconify from '../../components/iconify/Iconify';
// @mui
import {useTheme, styled, alpha} from '@mui/material/styles';
import {Button, IconButton, Container} from '@mui/material';
// sections
import MatrixTable from './components/MatrixTable';
import MatrixTableToolbar from './components/MatrixTableToolbar';

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
import {useState, useEffect} from'react';
import {Container, Stack, IconButton, Typography, Button} from '@mui/material';
import Iconify from '../../../components/iconify/Iconify';
import UserRefTable from './UserRefTable';
import UserRefAddModal from './UserRefAddModal';
import UserRefEditModal from './UserRefEditModal';
// -----------------------------------------------------------------------
export default function UserRefSection(){
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleClose = () => {
    setModalOpen(false);
  };

  return(
  <>
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction='row' spacing={2}>
          <Typography variant="h4" gutterBottom>
            User List
          </Typography>
        </Stack>
        <Button 
          variant="contained" 
          startIcon={<Iconify icon="eva:plus-fill" />} 
          onClick={() => setModalOpen(true)}
        >
          Add
        </Button>
      </Stack>

      <UserRefTable />

      <UserRefAddModal modalOpen={modalOpen} modalClose={handleClose} />
      
      {/* <UserRefEditModal modalOpen={modalOpen} modalClose={handleClose} /> */}
    </Container>
  </>)
}
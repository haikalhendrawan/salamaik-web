import {useState} from'react';
import {Container, Stack, IconButton, Typography, Button} from '@mui/material';
import Iconify from '../../components/iconify';
import UserRefTable from '../../sections/admin/userRef/UserRefTable';
import UserRefAddModal from '../../sections/admin/userRef/UserRefAddModal';
import UserRefEditModal from '../../sections/admin/userRef/UserRefEditModal';
import {users} from '../../mock/user';
// -----------------------------------------------------------------------

export default function UserRefPage () {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Container>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Stack direction='row' spacing={2}>
            <Typography variant="h4" gutterBottom>
              User List
            </Typography>
          </Stack>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setModalOpen(true)}>
            Add
          </Button>
        </Stack>

        
        <UserRefTable users={users} />

        <UserRefAddModal modalOpen={modalOpen} modalClose={handleClose} />
        
        {/* <UserRefEditModal modalOpen={modalOpen} modalClose={handleClose} /> */}
      
      </Container>
    </>

  );
};
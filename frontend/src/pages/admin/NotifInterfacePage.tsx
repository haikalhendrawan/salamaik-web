import {useState} from'react';
import {Container, Stack, IconButton, Typography, Button} from '@mui/material';
import Iconify from '../../components/iconify';
import NotifAddModal from '../../sections/admin/notifInterface/NotifAddModal';
// -----------------------------------------------------------------------


export default function NotifInterfacePage () {
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
              Notifications
            </Typography>
          </Stack>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setModalOpen(true)}>
            Add
          </Button>
        </Stack>
      
      </Container>

      <NotifAddModal modalOpen={modalOpen} modalClose={handleClose} />  
    </>

  );
};
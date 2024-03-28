import {Container, Stack, IconButton, Typography, Button} from '@mui/material';
import Iconify from '../../components/iconify';
import UserRefTable from '../../sections/admin/userRef/UserRefTable';
import {users} from '../../mock/user';


export default function UserRef () {
  return (
    <>
      <Container maxWidth="xl">

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Stack direction='row' spacing={2}>
            <Typography variant="h4" gutterBottom>
              User List
            </Typography>
          </Stack>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Add
          </Button>
        </Stack>

        {/* Table here */}
        <UserRefTable users={users} />
      
      </Container>
    </>

  );
};
import {useState, useEffect} from'react';
import {Container, Stack, IconButton, Typography, Button} from '@mui/material';
import Iconify from '../../../components/iconify/Iconify';
import UserRefTable from './UserRefTable';
import UserRefAddModal from './UserRefAddModal';
import UserRefEditModal from './UserRefEditModal';
import useUser from './useUser';
// -----------------------------------------------------------------------
export default function UserRefSection(){
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const [editId, setEditId] = useState<string>('');

  const {user} = useUser();

  const handleOpenAddModal = () => {
    setAddModalOpen(true);
    setEditModalOpen(false);
  };

  const handleOpenEditModal = (id: string) => {
    setEditModalOpen(true);
    setEditId(id);
    setAddModalOpen(false);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
  };

  const handleCloseEditModal = () =>{
    setEditModalOpen(false)
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
          onClick={handleOpenAddModal}
        >
          Add
        </Button>
      </Stack>

      <UserRefTable 
        users={user} 
        setEditModalOpen={handleOpenEditModal}
      />

      <UserRefAddModal
        modalOpen={addModalOpen} 
        modalClose={handleCloseAddModal} 
      />
      
      <UserRefEditModal 
        editId={editId}
        users={user} 
        modalOpen={editModalOpen}
        modalClose={handleCloseEditModal} 
      />
    </Container>
  </>)
}
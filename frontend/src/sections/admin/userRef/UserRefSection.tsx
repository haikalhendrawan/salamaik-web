/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState, useEffect} from'react';
import {Container, Stack, Typography, Button} from '@mui/material';
import Iconify from '../../../components/iconify/Iconify';
import UserRefTable from './UserRefTable';
import UserRefAddModal from './UserRefAddModal';
import UserRefEditModal from './UserRefEditModal';
import useUser from './useUser';
// -----------------------------------------------------------------------
export default function UserRefSection(){
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const [tab, setTab] = useState<0 | 1 | 2>(2);

  const [editId, setEditId] = useState<string>('');

  const [pageLoading, setPageLoading] = useState<boolean>(true);

  const {user, getUser} = useUser();

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

  useEffect(() => {
    async function getData(){
      try{
        await getUser();
        setPageLoading(false);
      }catch(err){
        setPageLoading(false);
      }
    }
    getData();
  }, [])

  return(
  <>
    <Container maxWidth='xl'>
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

      {pageLoading
        ?
          null
        :
          <>
            <UserRefTable 
              users={user} 
              setEditModalOpen={handleOpenEditModal}
              tab={tab}
              setTab={setTab}
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
          </>   
      }


    </Container>
  </>)
}
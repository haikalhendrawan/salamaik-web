import {useState, useEffect} from'react';
import {Container, Stack, IconButton, Typography, Button} from '@mui/material';
import axios from 'axios';
import { z } from 'zod';
import Iconify from '../../components/iconify';
import NotifAddModal from '../../sections/admin/notifInterface/NotifAddModal';
import NotifTable from '../../sections/admin/notifInterface/NotifTable';
// -----------------------------------------------------------------------
interface Notif{
  id: number,
  title: string | null,
  message: string | null,
  created_by: string | null,
  categories: number | null,
  published: number | null, 
  created_at: string,
};

// -----------------------------------------------------------------------
export default function NotifInterfacePage () {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<Notif[] | []>([]);

  const handleClose = () => {
    setModalOpen(false);
  };

  const addNotif = async(title: string, message: string, categories: number) => {
    try{
      const response = await axios.post("http://localhost:8080/addNotif", {title, message, categories});
      console.log(response.data);
      setModalOpen(false);
      getNotif();
    }catch(err){
      console.log(err);
    }
  };

  const getNotif= async()=>{
    try{
      const response = await axios.get("http://localhost:8080/getNotif"); 
      setNotifications(response.data);
      console.log(response.data);
    }catch(err){
      console.log(err);
    }
  };

  const assignNotif = async(notifID: number) => {
    try{
      const response = await axios.post("http://localhost:8080/assignNotif", {notifID: notifID});
      console.log(response.data);
      getNotif();
      window.location.reload(); 
    }catch(err){
      console.log(err);
    }
  };

  const deleteNotif = async(notifID: number) => {
    try{
      const response = await axios.post("http://localhost:8080/deleteNotif", {notifID: notifID});
      console.log(response.data);
      getNotif();
    }catch(err){
      console.log(err);
    }
  };

  useEffect(() => {
    getNotif(); 
  }, []);

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

        <NotifTable notifications={notifications} assignNotif={assignNotif} deleteNotif={deleteNotif}/>
      </Container>

      <NotifAddModal modalOpen={modalOpen} modalClose={handleClose} addNotif={addNotif}/>  

      
    </>

  );
};
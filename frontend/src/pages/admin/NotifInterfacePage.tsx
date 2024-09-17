/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState, useEffect} from'react';
import {Container, Stack, Typography, Button} from '@mui/material';
import axiosJWT from '../../config/axios';
import Iconify from '../../components/iconify';
import NotifAddModal from '../../sections/admin/notifInterface/NotifAddModal';
import NotifTable from '../../sections/admin/notifInterface/NotifTable';
import useSnackbar from '../../hooks/display/useSnackbar';
import useLoading from '../../hooks/display/useLoading';
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

  const { openSnackbar } = useSnackbar();

  const {setIsLoading} = useLoading();

  const handleClose = () => {
    setModalOpen(false);
  };

  const addNotif = async(title: string, message: string, categories: number) => {
    try{
      await axiosJWT.post(`/addNotif`, {title, message, categories});
      setModalOpen(false);
      getNotif();
      openSnackbar("Notification has been added", "success");
    }catch(err: any){
      openSnackbar(JSON.stringify(err.response.data.message), "error");
    }
  };

  const getNotif= async()=>{
    try{
      setIsLoading(true);
      const response = await axiosJWT.get(`/getNotif`); 
      setNotifications(response.data);
    }catch(err){
      openSnackbar("Failed to fetch notifications", "error");
      setIsLoading(false);
    }finally{
      setIsLoading(false);
    }
  };

  const assignNotif = async(notifID: number) => {
    try{
      await axiosJWT.post("/assignNotif", {notifID: notifID});
      await getNotif();
      window.location.reload(); 
      openSnackbar("Notification has been assigned", "success");
    }catch(err: any){
      openSnackbar(`Fail to assign notification, Err:${err.response.message}`, "error");
    }
  };

  const deleteNotif = async(notifID: number) => {
    try{
      await axiosJWT.post("/deleteNotif", {notifID: notifID});
      getNotif();
      openSnackbar("Notification has been deleted", "success");
    }catch(err: any){
      openSnackbar(`Fail to assign notification, Err:${err.response.message}`, "error");
    }
  };

  useEffect(() => {
    getNotif(); 
  }, []);

  return (
    <>
      <Container maxWidth="xl">
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
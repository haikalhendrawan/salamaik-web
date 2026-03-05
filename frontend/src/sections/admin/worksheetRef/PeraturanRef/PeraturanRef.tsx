/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

 import {useState, useEffect} from'react';
 import {Stack, Button, Box, Typography, Table, Card, Modal, FormControl, Paper, TableSortLabel,
           Tooltip, TableHead, Grow, TableBody, TableRow, TableCell} from '@mui/material';
 import { useTheme, styled } from '@mui/material/styles';
 import Iconify from '../../../../components/iconify';
 import Scrollbar from '../../../../components/scrollbar';
 import StyledTextField from '../../../../components/styledTextField/StyledTextField';
 import StyledButton from '../../../../components/styledButton/StyledButton';
 import useAxiosJWT from '../../../../hooks/useAxiosJWT';
 import useSnackbar from '../../../../hooks/display/useSnackbar';
 import StyledNumberTextField from '../../../../components/styledNumberTextField/StyledNumberTextField';
 import useDialog from '../../../../hooks/display/useDialog';
 // ---------------------------------------------------
 const TABLE_HEAD = [
   { id: 'id', label: 'Id', alignRight: false },
   { id: 'nomor', label: 'Nomor', alignRight: false },
   { id: 'hal', label: 'Hal', alignRight: false },
   { id: 'tahun', label: 'Tahun', alignRight: false },
   { id: 'action', label: 'Action', alignRight: false },
 ];
 
 interface PeraturanData{
   id: number,
   nomor: string,
   hal: string,
   tahun: number,
   file: string,
   deleted?: string
 };
 
 
 interface PeraturanRefProps {
   section: number,
   addState: boolean,
   resetAddState: () => void,
 };
 
 // ----------------------------------------------------------------------------------
 export default function PeraturanRef({section, addState, resetAddState}: PeraturanRefProps) {
   const theme = useTheme();
 
   const [open, setOpen] = useState<boolean>(false); // for edit modal
 
   const [editID, setEditID] = useState<number | null>(null);
 
   const [peraturanRef, setPeraturanRef] = useState<PeraturanData[]>([]);
 
   const axiosJWT = useAxiosJWT();
 
   const {openSnackbar} = useSnackbar();
 
   const {openDialog} = useDialog();
 
   const handleOpen = (id: number) => {
     setOpen(true);
     setEditID(id);
   };
 
   const handleClose = () => {
     setOpen(false);
     resetAddState();
   };
 
   const getData = async () => {
     try {
       const response = await axiosJWT.get("/getAllPeraturan");
       setPeraturanRef(response.data.rows);
     } catch (err) {
       openSnackbar("Fail to get referensi peraturan", "error");
     }
   };
 
   const handleDeletePeraturan = async (id: number) => {
     try {
       const response = await axiosJWT.get(`/deletePeraturan/${id}`);
       openSnackbar(response.data.message, "success");
       getData();
     } catch (err) {
       openSnackbar("Fail to delete referensi peraturan", "error");
     }
   };
   
   //set modal state utk add Data dan hide modal state buat nge edit
   useEffect(() => {
     if (addState && section===7) {
       setEditID(null);
       setOpen(true);
     }
 
   }, [addState, section]);
 
   useEffect(() => {
     getData();
   }, []);
 
   return (
     <>
       <Grow in>
         <Card sx={{minHeight:480, display:'flex', flexDirection:'column', gap:theme.spacing(1)}}>
           <Table>
             <TableHead>
               <TableRow>
                 {TABLE_HEAD.map((headCell) => (
                   <TableCell
                     key={headCell.id}
                     align={headCell.alignRight ? 'right' : 'left'}
                   >
                     <TableSortLabel hideSortIcon>
                       {headCell.label}
                     </TableSortLabel>
                   </TableCell>
                 ))}
               </TableRow>
             </TableHead>
             <TableBody>
               {peraturanRef?.map((row, index) => 
                 <TableRow hover key={row.id} tabIndex={-1}>
                   <TableCell align="justify">{index+1}</TableCell>
 
                   <TableCell align="left">{row.nomor}</TableCell>
 
                   <TableCell align="left">
                     {`${row.hal}`}

                   </TableCell>
 
                   <TableCell align="center">{row.tahun}</TableCell>
 
                   <TableCell align="justify">
                     <Stack direction='row' spacing={1}>
                       <Tooltip title='edit'>
                         <span>
                           <StyledButton 
                             aria-label="edit" 
                             variant='contained' 
                             size='small' 
                             color='warning'
                             onClick={() => handleOpen(row.id)}
                           >
                             <Iconify icon="solar:pen-bold-duotone"/>
                           </StyledButton>
                         </span>
                       </Tooltip>
                       <Tooltip title='delete'>
                         <span>
                           <StyledButton 
                             aria-label="delete" 
                             value='contained'
                             size='small' 
                             color='pink'
                             onClick={() => openDialog(
                               "Delete",
                               "Yakin hapus peraturan ini?",
                               'pink',
                               'Delete',
                               () => handleDeletePeraturan(row.id)
                             )}
                           >
                             <Iconify icon="solar:trash-bin-trash-bold"/>
                           </StyledButton>
                         </span>
                       </Tooltip>
                     </Stack>
                   </TableCell> 
                 </TableRow>
               )}
             </TableBody>
           </Table>
         </Card>
       </Grow>
 
       <PeraturanRefModal 
         modalOpen={open} 
         modalClose={handleClose} 
         addState={addState}
         editID={editID}
         data={peraturanRef || []}
         getData={getData}
       /> 
     </>
   )
 }
 
 
 // ----------------------------------------------------------------------------------
 const style = {
   position: 'absolute',
   top: '50%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   height:'60vh',
   width: '50vw',
   bgcolor: 'background.paper',
   boxShadow: 24,
   p: 4,
   borderRadius:'12px',
 };
 
 const FormDataContainer = styled(Box)(({theme}) => ({
   height:'100%',
   display: 'flex', 
   flexDirection:'column', 
   alignItems:'start', 
   justifyContent:'start', 
   marginTop:theme.spacing(5),
   gap:theme.spacing(3)
 }));
 
 interface PeraturanRefModalProps {
   modalOpen: boolean,
   modalClose: () => void,
   addState: boolean,
   editID: number | null,
   data: PeraturanData[],
   getData: () => void
 }
 
 
 //----------------------------------------------------------------
 function PeraturanRefModal({modalOpen, modalClose, addState, editID, data, getData}: PeraturanRefModalProps) {
   const {openSnackbar} = useSnackbar();
 
   const axiosJWT = useAxiosJWT();
 
   const [addValue, setAddValue] = useState<PeraturanData>({
     id: 0,
     nomor: '',
     hal: '',
     tahun: new Date().getFullYear(),
     file: '',
   });
 
   const handleChangeAdd = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     setAddValue({
       ...addValue,
       [e.target.name]:e.target.name === 'bobot' ? Number(e.target.value) : e.target.value
     })
   };
 
   const handleResetAdd = () => {
     setAddValue({
      id: 0,
      nomor: '',
      hal: '',
      tahun:new Date().getFullYear(),
      file: '',
     })
   };
 
   const [editValue, setEditValue] = useState<PeraturanData>({
     id: 0,
     nomor: '',
     hal: '',
     tahun: new Date().getFullYear(),
     file: '',
   });
 
   const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     setEditValue({
       ...editValue,
       [e.target.name]: e.target.name === 'bobot' ? Number(e.target.value) : e.target.value
     })
   };
 
   const handleResetEdit = () => {
     setEditValue({
       id: data.filter((row) => row.id===editID)[0].id,
       nomor: data.filter((row) => row.id===editID)[0].nomor,
       hal: data.filter((row) => row.id===editID)[0].hal,
       tahun: data.filter((row) => row.id===editID)[0].tahun,
       file: data.filter((row) => row.id===editID)[0].file,
     })
   };
 
   const handleAddPeraturan = async () => {
     try {
       const form = {
         nomor: addValue.nomor,
         hal: addValue.hal,
         tahun: addValue.tahun,
       };
 
       const response = await axiosJWT.post('/addPeraturan', form);
 
       openSnackbar(response.data.message, 'success');
       getData();
       modalClose();
       handleResetAdd();
     } catch (error) {
       openSnackbar('Failed to add peraturan', 'error');
     }
   };
 
   const handleEditPeraturan = async () => {
     try {
       const form = {
         id: editValue.id,
         nomor: editValue.nomor,
         hal: editValue.hal,
         tahun: editValue.tahun,
       };
 
       const response = await axiosJWT.post('/editPeraturan', form);
 
       openSnackbar(response.data.message, 'success');
       getData();
       modalClose();
       handleResetEdit();
     } catch (error) {
       openSnackbar('Failed to edit peraturan', 'error');
     }
   };
 
   useEffect(() => {
     if(data && editID){
       setEditValue({
         id: data.filter((row) => row.id===editID)[0].id,
         nomor: data.filter((row) => row.id===editID)[0].nomor,
         hal: data.filter((row) => row.id===editID)[0].hal,
         tahun: data.filter((row) => row.id===editID)[0].tahun,
         file: data.filter((row) => row.id===editID)[0].file,
       })
     }
   }, [data, editID])
 
 
   // ----------------------------------------------------------------------------------------
   return(
       <>
       <Modal open={modalOpen} onClose={modalClose}>
         <Box sx={style}>
           <Scrollbar>
             <Paper sx={{height:'50vh', width:'auto', p:2}}>
               <Typography variant="h6" sx={{ mb: 2 }}>
                 {addState? 'Add ':'Edit '} 
                 Peraturan
               </Typography>
 
                   <FormDataContainer>
                     <Stack direction='row' spacing={2} sx={{width:'100%'}} justifyContent={'start'}>
                       <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                         <FormControl>
                           <StyledTextField 
                             name="nomor" 
                             label="Nomor Peraturan"
                             multiline
                             minRows={2}
                             value={ addState? addValue.nomor : editValue.nomor}
                             onChange={addState? handleChangeAdd : handleChangeEdit}
                             helperText="cth: PER-1/PB/2023"
                           />
                         </FormControl>
 
                         <FormControl>
                           <StyledTextField 
                             name="hal" 
                             label="Judul Peraturan"
                             multiline
                             minRows={2}
                             value={ addState? addValue.hal : editValue.hal}
                             onChange={addState? handleChangeAdd : handleChangeEdit}
                             helperText="cth: Pembinaan dan Supervisi KPPN "
                           />
                         </FormControl>
 
                       </Stack>
                       <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                         <FormControl sx={{display:'flex', alignItems:'center', flexDirection: 'row', gap:2}}>
                           <StyledNumberTextField 
                             name="tahun" 
                             label="Tahun"
                             value={ addState? addValue.tahun : editValue.tahun}
                             onChange={addState? handleChangeAdd : handleChangeEdit}  
                           />
                         </FormControl>
                       </Stack>
                     </Stack>
 
                     <Stack sx={{width:'100%', pr:3, mt:1}} direction='row' spacing={2} flex={'row'} justifyContent={'end'}>
                       <Button 
                         variant='contained'
                         color={addState? 'primary' : 'warning'} 
                         sx={{borderRadius:'8px'}}
                         onClick={addState? handleAddPeraturan : handleEditPeraturan}
                       >
                         {addState? 'Add' : 'Edit'} 
                       </Button>
                       <Button 
                         variant='contained' 
                         color="white"
                         onClick={addState? handleResetAdd : handleResetEdit}
                       >
                         Reset
                       </Button>
                     </Stack>
                   </FormDataContainer>
 
             </Paper>
           </Scrollbar>
         </Box>
       </Modal>
       
       </>
   )
 }
 
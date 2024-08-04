import {useState, useEffect} from'react';
import dayjs, { Dayjs } from 'dayjs';
import {Stack, Button, Box, Typography, SelectChangeEvent, Modal, FormControl, Paper,MenuItem} from '@mui/material';
import { StyledSelect, StyledSelectLabel } from '../../../../components/styledSelect';
import { styled } from '@mui/material/styles';
import { BatchType } from './useBatch';
import StyledDatePicker from '../../../../components/styledDatePicker';
import Scrollbar from '../../../../components/scrollbar/Scrollbar';
import useDictionary from '../../../../hooks/useDictionary';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useLoading from '../../../../hooks/display/useLoading';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useBatch from './useBatch';
// -------------------------------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height:'55vh',
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

interface BatchFormType{
  id: string, 
  kppnId: string,
  openPeriod: Dayjs | null,
  closePeriod: Dayjs | null,
  openFollowUp: Dayjs | null,
  closeFollowUp: Dayjs | null
};

interface BatchRefModalProps {
  modalOpen: boolean,
  modalClose: () => void,
  addState: boolean,
  editID: string | null,
  data: BatchType[]
};
//----------------------------------------------------------------
export default function BatchRefModal({modalOpen, modalClose, addState, editID, data}: BatchRefModalProps) {
  const { kppnRef } = useDictionary();

  const {openSnackbar} = useSnackbar();

  const {setIsLoading} = useLoading();

  const axiosJWT = useAxiosJWT();

  const {getBatch} = useBatch();
  
  const [addValue, setAddValue] = useState<BatchFormType>({
    id: '',
    kppnId: '',
    openPeriod: null,
    closePeriod: null,
    openFollowUp: null,
    closeFollowUp: null
  });

  const handleChangeAdd = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent<unknown>) => {
    setAddValue({
      ...addValue,
      [e.target.name]:e.target.value
    })
  };

  const handleResetAdd = () => {
    setAddValue({
      id: '',
      kppnId: '',
      openPeriod: null,
      closePeriod: null,
      openFollowUp: null,
      closeFollowUp: null
    })
  };

  const [editValue, setEditValue] = useState<BatchFormType>({
    id: '',
    kppnId: '',
    openPeriod: null,
    closePeriod: null,
    openFollowUp: null,
    closeFollowUp: null
  });

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent<unknown>) => {
    setEditValue({
      ...editValue,
      [e.target.name]:e.target.value
    })
  };

  const handleResetEdit = () => {
    setEditValue({
      id: data.filter((row) => row.id===editID)[0].id,
      kppnId: data.filter((row) => row.id===editID)[0].kppn_id,
      openPeriod: dayjs(data.filter((row) => row.id===editID)[0].open_period),
      closePeriod: dayjs(data.filter((row) => row.id===editID)[0].close_period),
      openFollowUp: dayjs(data.filter((row) => row.id===editID)[0].open_follow_up),
      closeFollowUp: dayjs(data.filter((row) => row.id===editID)[0].close_follow_up)
    })
  };

  const handleSubmitAdd = async() => {
    try{
      setIsLoading(true);
      const data = {
        kppnId: addValue.kppnId, 
        startDate: dayjs(addValue.openPeriod).format('YYYY-MM-DD'), 
        closeDate: dayjs(addValue.closePeriod).format('YYYY-MM-DD'),
        openFollowUp: dayjs(addValue.openFollowUp).format('YYYY-MM-DD'), 
        closeFollowUp: dayjs(addValue.closeFollowUp).format('YYYY-MM-DD'),
      };
      const response = await axiosJWT.post('/addWorksheet', data);
      openSnackbar(response.data.message, "success");
      getBatch();
      setIsLoading(false);
      modalClose();
    }catch(err: any){
      if(err.response){
        openSnackbar(err.response.data.message, "error");
        setIsLoading(false);
      }else{
        openSnackbar("Network Error", "error");
        setIsLoading(false);
      }
    }
  };

  const handleSubmitEdit= async() => {
    try{
      setIsLoading(true);
      const data = {
        worksheetId: editValue.id, 
        startDate: dayjs(editValue.openPeriod).format('YYYY-MM-DD'), 
        closeDate: dayjs(editValue.closePeriod).format('YYYY-MM-DD'),
        openFollowUp: dayjs(editValue.openFollowUp).format('YYYY-MM-DD'), 
        closeFollowUp: dayjs(editValue.closeFollowUp).format('YYYY-MM-DD'),
      };
      const response = await axiosJWT.post('/editWorksheetPeriod', data);
      openSnackbar(response.data.message, "success");
      getBatch();
      setIsLoading(false);
      modalClose();
    }catch(err: any){
      if(err.response){
        openSnackbar(err.response.data.message, "error");
        setIsLoading(false);
      }else{
        openSnackbar("Network Error", "error");
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if(data && editID){
      setEditValue({
        id: data.filter((row) => row.id===editID)[0].id,
        kppnId: data.filter((row) => row.id===editID)[0].kppn_id,
        openPeriod: dayjs(data.filter((row) => row.id===editID)[0].open_period),
        closePeriod: dayjs(data.filter((row) => row.id===editID)[0].close_period),
        openFollowUp: dayjs(data.filter((row) => row.id===editID)[0].open_follow_up),
        closeFollowUp: dayjs(data.filter((row) => row.id===editID)[0].close_follow_up)
      })
    }
  }, [data, editID])


  // ----------------------------------------------------------------------------------------
  return(
      <>
      <Modal open={modalOpen} onClose={modalClose} keepMounted>
        <Box sx={style}>
          <Scrollbar>
            <Paper sx={{height:'50vh', width:'auto', p:2}}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {addState? 'Add ':'Edit '} 
                Period
              </Typography>

                  <FormDataContainer>
                    <Stack direction='row' spacing={2} sx={{width:'100%'}} justifyContent={'start'}>
                      <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                        <FormControl>
                          <StyledSelectLabel id="kppn-select-label">Unit</StyledSelectLabel>
                          <StyledSelect 
                            required 
                            name="kppnId" 
                            label="kppn"
                            labelId="kppn-select-label"
                            value={addState ? addValue.kppnId : editValue.kppnId}
                            onChange={addState? handleChangeAdd : handleChangeEdit}
                            disabled={!addState}
                          >
                            {kppnRef?.list?.filter((item) => item.level===0).map((row: any, index: number) => (
                              <MenuItem 
                                key={index+1} 
                                sx={{ fontSize: 14 }} 
                                value={row.id}
                              >
                                {row.alias}
                              </MenuItem>
                            ))}
                          </StyledSelect>
                        </FormControl>
                      </Stack>
                      <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                        <FormControl>
                          <StyledDatePicker 
                            label="Open Period"
                            name= "openPeriod"
                            value={addState ? addValue.openPeriod : editValue.openPeriod}
                            onChange={addState
                                      ? (newValue: Dayjs) => setAddValue({...addValue, openPeriod: newValue}) 
                                      : (newValue: Dayjs) => setEditValue({...editValue, openPeriod: newValue})}
                          />
                        </FormControl>

                        <FormControl>
                          <StyledDatePicker 
                            label="Close Period"
                            name= "closePeriod"
                            value={addState ? addValue.closePeriod : editValue.closePeriod}
                            onChange={addState
                                      ? (newValue: Dayjs) => setAddValue({...addValue, closePeriod: newValue}) 
                                      : (newValue: Dayjs) => setEditValue({...editValue, closePeriod: newValue})}
                          />
                        </FormControl>
                      </Stack>
                    </Stack>
                    <Stack direction='row' spacing={2} sx={{width:'100%'}} justifyContent={'start'}>
                      <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                        
                      </Stack>
                      <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                        <FormControl>
                          <StyledDatePicker 
                            label="Open Period (Tindak lanjut)"
                            name= "openFollowUp"
                            value={addState ? addValue.openFollowUp : editValue.closeFollowUp}
                            onChange={addState
                                      ? (newValue: Dayjs) => setAddValue({...addValue, openFollowUp: newValue}) 
                                      : (newValue: Dayjs) => setEditValue({...editValue, openFollowUp: newValue})}
                          />
                        </FormControl>

                        <FormControl>
                          <StyledDatePicker 
                            label="Close Period (Tindak lanjut)"
                            name= "closePeriod"
                            value={addState ? addValue.closeFollowUp : editValue.closeFollowUp}
                            onChange={addState
                                      ? (newValue: Dayjs) => setAddValue({...addValue, closeFollowUp: newValue}) 
                                      : (newValue: Dayjs) => setEditValue({...editValue, closeFollowUp: newValue})}
                          />
                        </FormControl>
                      </Stack>
                    </Stack>

                    <Stack sx={{width:'100%', pr:3, mt:1}} direction='row' spacing={2} flex={'row'} justifyContent={'end'}>
                      <Button 
                        variant='contained'
                        color={addState? 'primary' : 'warning'} 
                        sx={{borderRadius:'8px'}}
                        onClick={addState? handleSubmitAdd : handleSubmitEdit}
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
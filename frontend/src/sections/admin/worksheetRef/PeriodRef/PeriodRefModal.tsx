/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState, useEffect} from'react';
import {Stack, Button, Box, Typography, MenuItem, Modal, FormControl, Paper, SelectChangeEvent} from '@mui/material';
import { styled } from '@mui/material/styles';
import Scrollbar from '../../../../components/scrollbar';
import { StyledSelect, StyledSelectLabel } from '../../../../components/styledSelect';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useLoading from '../../../../hooks/display/useLoading';
import useDictionary from '../../../../hooks/useDictionary';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import { PeriodType } from '../../../../hooks/useDictionary';
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

interface PeriodRefModalProps {
  modalOpen: boolean,
  modalClose: () => void,
  addState: boolean,
  editID: number | null,
  data: PeriodType[] | null
};


//----------------------------------------------------------------
export default function PeriodRefModal({modalOpen, modalClose, addState, editID, data}: PeriodRefModalProps) {
  const {setIsLoading} = useLoading();

  const {openSnackbar} = useSnackbar();

  const {getDictionary} = useDictionary();

  const axiosJWT = useAxiosJWT();

  const [addValue, setAddValue] = useState<PeriodType>({
    id: 0,
    name: '',
    even_period: 0,
    semester: 1,
    tahun: new Date().getFullYear(),
  });

  const handleSubmitAdd = async() => {
    console.log(addValue);
    try{
      setIsLoading(true);
      const data = {
        semester: addValue.semester,
        tahun: addValue.tahun,
      };
      const response = await axiosJWT.post('/addPeriod', data);
      openSnackbar(response.data.message, "success");
      getDictionary();
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

  const handleChangeAdd = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent<unknown>) => {
    setAddValue({
      ...addValue,
      [e.target.name]:e.target.value
    })
  };

  const handleResetAdd = () => {
    setAddValue({
      id: 0,
      name: '',
      even_period: 0,
      semester: 1,
      tahun: new Date().getFullYear(),
    })
  };

  const [editValue, setEditValue] = useState<PeriodType>({
    id: 0,
    name: '',
    even_period: 0,
    semester: 1,
    tahun: new Date().getFullYear(),
  });

  const handleSubmitEdit = () => {
   
  };

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | SelectChangeEvent<unknown>) => {
    setEditValue({
      ...editValue,
      [e.target.name]:e.target.value
    })
  };

  const handleResetEdit = () => {
    setEditValue({
      id: data?.filter((row) => row.id===editID)[0].id || 0,
      name: data?.filter((row) => row.id===editID)[0].name || '',
      even_period: data?.filter((row) => row.id===editID)[0].even_period || 0,
      semester: data?.filter((row) => row.id===editID)[0].semester || 1,
      tahun: data?.filter((row) => row.id===editID)[0].tahun || new Date().getFullYear(),
    })
  };

  useEffect(() => {
    if(data && editID){
      setEditValue({
        id: data?.filter((row) => row.id===editID)[0].id || 0,
        name: data?.filter((row) => row.id===editID)[0].name || '',
        even_period: data?.filter((row) => row.id===editID)[0].even_period || 0,
        semester: data?.filter((row) => row.id===editID)[0].semester || 1,
        tahun: data?.filter((row) => row.id===editID)[0].tahun || new Date().getFullYear(),
      })
    }
  }, [data, editID]);

  function getYearRange() {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 2;
    const endYear = currentYear + 5;
    const years = [];
  
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
  
    return years;
  };


  // ----------------------------------------------------------------------------------------
  return(
      <>
      <Modal open={modalOpen} onClose={modalClose}>
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
                          <StyledSelectLabel id="tahun-select-label" sx={{typography:'body2'}}>Tahun</StyledSelectLabel>
                            <StyledSelect 
                              name="tahun" 
                              label='Tahun'
                              labelId="tahun-select-label"
                              value={addState? addValue.tahun.toString() : editValue.tahun.toString()}
                              onChange={addState? handleChangeAdd : handleChangeEdit}
                              sx={{typography:'body2', fontSize:14, height:'100%'}}
                            >
                              {getYearRange().map((year, index) => (
                                <MenuItem key={index} sx={{fontSize:14}} value={year}>{year}</MenuItem>
                              ))}
                          </StyledSelect>
                        </FormControl>
                      </Stack>
                      <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                        <FormControl>
                          <StyledSelectLabel id="semester-select-label" sx={{typography:'body2'}}>Semester</StyledSelectLabel>
                            <StyledSelect 
                              name="semester" 
                              label='Semester'
                              labelId="semester-select-label"
                              value={addState? addValue.semester.toString() : editValue.semester.toString()}
                              onChange={addState? handleChangeAdd : handleChangeEdit}
                              sx={{typography:'body2', fontSize:14, height:'100%'}}
                            >
                              <MenuItem key={0} sx={{fontSize:14}} value={1}>1 (Ganjil)</MenuItem>
                              <MenuItem key={1} sx={{fontSize:14}} value={2}>2 (Genap)</MenuItem>
                          </StyledSelect>
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
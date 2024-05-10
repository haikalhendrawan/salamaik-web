import {useState, useEffect, useRef, useMemo} from'react';
import {Stack, Button, Box, Typography, Modal, FormControl, Paper, InputLabel, 
        Select, MenuItem, SelectChangeEvent} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Scrollbar from '../../../../components/scrollbar';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import StyledButton from '../../../../components/styledButton/StyledButton';
import useChecklist from './useChecklist';
import useDictionary from '../../../../hooks/useDictionary';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useLoading from '../../../../hooks/display/useLoading';
import PageLoading from '../../../../components/pageLoading';
// -------------------------------------------------------------------------------------------
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height:'90vh',
  width: '65vw',
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

interface ChecklistType{
  id: number,
  title: string, 
  header: string | null,
  komponen_id: number,
  subkomponen_id: number,
  subsubkomponen_id: number | null,
  standardisasi: number | null, 
  matrix_title: string | null, 
  file1: string | null,
  file2: string | null,
  opsi: OpsiType[] | null,
  instruksi?: string | null,
  contoh_file?: string | null
};

interface OpsiType{
  id: number,
  title: string, 
  value: number,
  checklist_id: number
};

interface ChecklistRefModalProps {
  modalOpen: boolean,
  modalClose: () => void,
  addState: boolean,
  editID: number | null,
};


//----------------------------------------------------------------
export default function ChecklistRefModal({modalOpen, modalClose, addState, editID}: ChecklistRefModalProps) {
  const {checklist, getChecklist} = useChecklist();

  const axiosJWT = useAxiosJWT();

  const {setIsLoading} = useLoading();

  const {openSnackbar} = useSnackbar();

  const {komponenRef, subKomponenRef, subSubKomponenRef} = useDictionary();

  const [addValue, setAddValue] = useState<ChecklistType>({
    id: 0,
    title: '', 
    header: '',
    komponen_id: 1,
    subkomponen_id: 1,
    subsubkomponen_id: 0,
    standardisasi: 0, 
    matrix_title: '', 
    file1: null,
    file2: null,
    opsi: null,
    instruksi: '',
    contoh_file: ''
  });

  const handleChangeAdd = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    setAddValue({
      ...addValue,
      [e.target.name]:e.target.value
    })
  };

  const handleResetAdd = () => {
    setAddValue({
      id: 0,
      title: '', 
      header: '',
      komponen_id: 1,
      subkomponen_id: 1,
      subsubkomponen_id: 0,
      standardisasi: 0, 
      matrix_title: '', 
      file1: null,
      file2: null,
      opsi: null,
      instruksi: '',
      contoh_file: ''
    })
  };

  const [editValue, setEditValue] = useState<ChecklistType>({
    id: 0,
    title: '', 
    header: '',
    komponen_id: 1,
    subkomponen_id: 1,
    subsubkomponen_id: 0,
    standardisasi: 0, 
    matrix_title: '', 
    file1: null,
    file2: null,
    opsi: null,
    instruksi: '',
    contoh_file: ''
  });

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    setEditValue({
      ...editValue,
      [e.target.name]:e.target.value
    })
  };

  const handleResetEdit = () => {
    setEditValue({
      id: checklist?.filter((row) => row.id===editID)[0]?.id || 0,
      title: checklist?.filter((row) => row.id===editID)[0]?.title || '',
      header: checklist?.filter((row) => row.id===editID)[0]?.header || null,
      komponen_id: checklist?.filter((row) => row.id===editID)[0]?.komponen_id || 1,
      subkomponen_id: checklist?.filter((row) => row.id===editID)[0]?.subkomponen_id || 1,
      subsubkomponen_id: checklist?.filter((row) => row.id===editID)[0]?.subsubkomponen_id || 0,
      standardisasi: checklist?.filter((row) => row.id===editID)[0]?.standardisasi || 0,
      matrix_title: checklist?.filter((row) => row.id===editID)[0]?.matrix_title || '',
      file1: checklist?.filter((row) => row.id===editID)[0]?.file1 || null,
      file2: checklist?.filter((row) => row.id===editID)[0]?.file2 || null,
      opsi: checklist?.filter((row) => row.id===editID)[0]?.opsi || null,
      instruksi: checklist?.filter((row) => row.id===editID)[0]?.instruksi || '',
      contoh_file: checklist?.filter((row) => row.id===editID)[0]?.contoh_file || ''
    })
  };

  const handleSubmitEdit = async() => {
    const body = {
      id: editValue.id, //if this invalid will be checked on server
      title: editValue.title, //if this invalid will be checked on server
      header: editValue.header===''?null:editValue.header,
      komponen_id: editValue.komponen_id, //if this invalid will be checked on server
      subkomponen_id: editValue.subkomponen_id, //if this invalid will be checked on server
      subsubkomponen_id: editValue.subsubkomponen_id===0?null:editValue.subsubkomponen_id,
      standardisasi: editValue.standardisasi===null?0:editValue.standardisasi, 
      matrix_title: editValue.matrix_title===null?editValue.title:editValue.matrix_title, 
      file1: editValue.file1===''?null:editValue.file1,
      file2: editValue.file2===''?null:editValue.file2,
      instruksi: editValue.instruksi===''?null:editValue.instruksi,
      contoh_file: editValue.contoh_file===''?null:editValue.contoh_file
    }
    try{
      setIsLoading(true);
      const response = await axiosJWT.post("/editChecklist", body);
      openSnackbar(response.data.message, "success");
      setIsLoading(false);
      modalClose();
      getChecklist();
    }catch(err: any){
      if(err.response){
        setIsLoading(false);
        openSnackbar(err.response.data.message, "error");
      }else{
        setIsLoading(false);
        openSnackbar(err.response.data.message, "error");
      }
    }finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if(checklist && editID){
      setEditValue({
        id: checklist?.filter((row) => row.id===editID)[0]?.id || 0,
        title: checklist?.filter((row) => row.id===editID)[0]?.title || '',
        header: checklist?.filter((row) => row.id===editID)[0]?.header || null,
        komponen_id: checklist?.filter((row) => row.id===editID)[0]?.komponen_id || 1,
        subkomponen_id: checklist?.filter((row) => row.id===editID)[0]?.subkomponen_id || 1,
        subsubkomponen_id: checklist?.filter((row) => row.id===editID)[0]?.subsubkomponen_id || 0,
        standardisasi: checklist?.filter((row) => row.id===editID)[0]?.standardisasi || 0,
        matrix_title: checklist?.filter((row) => row.id===editID)[0]?.matrix_title || '',
        file1: checklist?.filter((row) => row.id===editID)[0]?.file1 || null,
        file2: checklist?.filter((row) => row.id===editID)[0]?.file2 || null,
        opsi: checklist?.filter((row) => row.id===editID)[0]?.opsi || null,
        instruksi: checklist?.filter((row) => row.id===editID)[0]?.instruksi || '',
        contoh_file: checklist?.filter((row) => row.id===editID)[0]?.contoh_file || ''
      })
    }

  }, [checklist, editID])

  useEffect(() => {
    if(addState){
      setAddValue((prev) => ({...prev, subsubkomponen_id: 0}))
    }else{
      setEditValue((prev) => ({...prev, subsubkomponen_id: 0}))
    }
  }, [addValue.komponen_id, editValue.komponen_id])


  // ----------------------------------------------------------------------------------------
  return(
    <>
      <Modal keepMounted open={modalOpen} onClose={modalClose}>
        <Box sx={style}>
          <Scrollbar>
            <Paper sx={{height:'80vh', width:'auto', p:2}}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {addState? 'Add ':'Edit '} 
                Checklist
              </Typography>

              <FormDataContainer>
                <Stack direction='row' spacing={2} sx={{width:'100%'}} justifyContent={'center'}>
                  <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                    <FormControl>
                      <StyledTextField 
                        name="title" 
                        label="Judul Checklist"
                        multiline
                        minRows={2}
                        value={ addState? addValue.title : editValue.title}
                        onChange={addState? handleChangeAdd : handleChangeEdit}
                      />
                    </FormControl>

                    <FormControl>
                      <InputLabel id="komponen-select-label" sx={{typography:'body2'}}>Komponen</InputLabel>
                      <Select 
                        name="komponen_id" 
                        label='Komponen'
                        labelId="komponen-select-label"
                        value={addState? addValue?.komponen_id?.toString() : editValue?.komponen_id?.toString()}
                        onChange={addState? handleChangeAdd : handleChangeEdit}
                        sx={{typography:'body2', fontSize:14, height:'100%'}}
                      >
                        {komponenRef?.map((row) => (
                          <MenuItem key={row.id} sx={{fontSize:14}} value={row.id}>{row.title}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <InputLabel id="subsubkomponen-select-label" sx={{typography:'body2'}}>Sub Sub Komponen</InputLabel>
                      <Select 
                        name="subsubkomponen_id" 
                        label='Sub Sub Komponen'
                        labelId="subsubkomponen-select-label"
                        value={addState? addValue?.subsubkomponen_id?.toString() : editValue?.subsubkomponen_id?.toString()}
                        onChange={addState? handleChangeAdd : handleChangeEdit}
                        sx={{typography:'body2', fontSize:14, height:'100%'}}
                      >
                        <MenuItem key={'0'} sx={{fontSize:14}} value={'0'}>Default</MenuItem>
                        {subSubKomponenRef
                        ?.filter((row) => row.komponen_id===(addState? addValue.komponen_id : editValue.komponen_id))
                        .map((row) => (
                          <MenuItem key={row.id} sx={{fontSize:14}} value={row?.id?.toString()}>{row.title}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <StyledTextField 
                        name="instruksi" 
                        label="Instruksi"
                        multiline
                        minRows={2}
                        value={ addState? addValue.instruksi : editValue.instruksi}
                        onChange={addState? handleChangeAdd : handleChangeEdit}
                      />
                    </FormControl>

                  </Stack>
                  <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                    <FormControl>
                      <StyledTextField 
                        name="header" 
                        label="Header"
                        multiline
                        minRows={2}
                        value={ addState? addValue.header : editValue.header}
                        onChange={addState? handleChangeAdd : handleChangeEdit}
                      />
                    </FormControl>
                  
                    <FormControl>
                      <InputLabel id="subkomponen-select-label" sx={{typography:'body2'}}>Sub Komponen</InputLabel>
                      <Select 
                        name="subkomponen_id" 
                        label='Sub Komponen'
                        labelId="subkomponen-select-label"
                        value={addState? addValue?.subkomponen_id?.toString() : editValue?.subkomponen_id?.toString()}
                        onChange={addState? handleChangeAdd : handleChangeEdit}
                        sx={{typography:'body2', fontSize:14, height:'100%'}}
                      >
                        {subKomponenRef
                          ?.filter((row) => row.komponen_id===(addState? addValue.komponen_id : editValue.komponen_id))
                          .map((row) => (
                            <MenuItem key={row.id} sx={{fontSize:14}} value={row?.id?.toString()}>{row.title}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <InputLabel id="standardisasi-kppn-label" sx={{typography:'body2'}}>Standardisasi KPPN</InputLabel>
                      <Select 
                        name="standardisasi" 
                        label='Standardisasi KPPN'
                        labelId="standardisasi-kppn-label"
                        value={addState? addValue?.standardisasi?.toString() : editValue?.standardisasi?.toString()}
                        onChange={addState? handleChangeAdd : handleChangeEdit}
                        sx={{typography:'body2', fontSize:14, height:'100%'}}
                      >
                        <MenuItem key={0} sx={{fontSize:14}} value={0}>Tidak</MenuItem>
                        <MenuItem key={1} sx={{fontSize:14}} value={1}>Ya</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <StyledTextField 
                        name="contoh_file" 
                        label="Contoh file"
                        multiline
                        minRows={2}
                        value={addState? (addValue.contoh_file ?? '') : (editValue.contoh_file ?? '')}
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
                    onClick={addState? () => {} : handleSubmitEdit}
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
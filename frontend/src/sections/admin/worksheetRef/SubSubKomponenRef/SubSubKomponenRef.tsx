import {useState, useEffect, useRef} from'react';
import {Stack, Button, Box, Typography, Table, Card, Modal, FormControl, Paper, InputLabel, TableSortLabel,
  Tooltip, TableHead, Grow, TableBody, TableRow, TableCell, Select, MenuItem} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import Label from '../../../../components/label';
import Scrollbar from '../../../../components/scrollbar';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import StyledButton from '../../../../components/styledButton/StyledButton';
//----------------------------------------------------
const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'subsubkomponen', label: 'Nama Sub Sub Komponen', alignRight: false },
  { id: 'subkomponen', label: 'Sub Komponen', alignRight: false },
  { id: 'komponen', label: 'Komponen', alignRight: false },
  { id: 'checklist', label: 'Checklist', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

interface SubSubKomponenData{
  id: number,
  subsubkomponen:string,
  subkomponen: number,
  komponen:number,
  numChecklist?: number,
}

const TABLE_DATA: SubSubKomponenData[] = [
  {id:1, subsubkomponen:'RPD Satuan Kerja', subkomponen:0, komponen:0, numChecklist:10},
  {id:2, subsubkomponen:'Penyelesaian Tagihan', subkomponen:1, komponen:1, numChecklist:34},
  {id:3, subsubkomponen:'Pengelolaan Data Kontrak dan Data Supplier', subkomponen:2, komponen:2, numChecklist:5,},
  {id:4, subsubkomponen:'Support data dan hubungan kelembagaan Satker dalam rangka analisis RPA, SR, KFR', subkomponen:3, komponen:3, numChecklist:17},
];

const TABLE_DATA2 = [
  {
      "subsubcomponent_ID": "1",
      "subsubcomponent_title": "RPD Satuan Kerja",
      "component_ID": "1",
      "subcomponent_ID": "1"
  },
  {
      "subsubcomponent_ID": "2",
      "subsubcomponent_title": "Penyelesaian Tagihan",
      "component_ID": "1",
      "subcomponent_ID": "2"
  },
  {
      "subsubcomponent_ID": "3",
      "subsubcomponent_title": "Pengelolaan Data Kontrak dan Data Supplier",
      "component_ID": "1",
      "subcomponent_ID": "2"
  },
  {
      "subsubcomponent_ID": "4",
      "subsubcomponent_title": "Support data dan hubungan kelembagaan Satker dalam rangka analisis RPA, SR, KFR",
      "component_ID": "1",
      "subcomponent_ID": "3"
  },
  {
      "subsubcomponent_ID": "5",
      "subsubcomponent_title": "Simplifikasi Pelaksanaan Anggaran melalui Digitalisai Pembayaran",
      "component_ID": "1",
      "subcomponent_ID": "3"
  },
  {
      "subsubcomponent_ID": "6",
      "subsubcomponent_title": "Evaluasi Pelaksanaan Anggaran Satker K/L, BLU, BLUD",
      "component_ID": "1",
      "subcomponent_ID": "3"
  },
  {
      "subsubcomponent_ID": "7",
      "subsubcomponent_title": "Tata Kelola Konfirmasi Penerimaan Negara",
      "component_ID": "1",
      "subcomponent_ID": "4"
  },
  {
      "subsubcomponent_ID": "8",
      "subsubcomponent_title": "Tata Kelola Rekening  Satuan Kerja",
      "component_ID": "1",
      "subcomponent_ID": "4"
  },
  {
      "subsubcomponent_ID": "9",
      "subsubcomponent_title": "Verifikasi LPJ Bendahara Satker",
      "component_ID": "1",
      "subcomponent_ID": "5"
  },
  {
      "subsubcomponent_ID": "10",
      "subsubcomponent_title": "Penyusunan Laporan UAKBUN Daerah",
      "component_ID": "1",
      "subcomponent_ID": "5"
  },
  {
      "subsubcomponent_ID": "11",
      "subsubcomponent_title": "Pembinaan Kompetensi Teknis Pejabat Perbendaharaan Satker",
      "component_ID": "1",
      "subcomponent_ID": "6"
  },
  {
      "subsubcomponent_ID": "12",
      "subsubcomponent_title": "Customer Service Officer",
      "component_ID": "3",
      "subcomponent_ID": "12"
  },
  {
      "subsubcomponent_ID": "13",
      "subsubcomponent_title": "Asistensi Digitalisasi Pembayaran (KKP,Digipay, VA)",
      "component_ID": "3",
      "subcomponent_ID": "12"
  },
  {
      "subsubcomponent_ID": "14",
      "subsubcomponent_title": "Asistensi dan Evaluasi Aplikasi SAKTI",
      "component_ID": "3",
      "subcomponent_ID": "12"
  },
  {
      "subsubcomponent_ID": "15",
      "subsubcomponent_title": "Asistensi Penyusunan Laporan Keuangan",
      "component_ID": "3",
      "subcomponent_ID": "12"
  },
  {
      "subsubcomponent_ID": "16",
      "subsubcomponent_title": "Pedampingan dan Layanan Konsultasi Keuangan Daerah",
      "component_ID": "3",
      "subcomponent_ID": "12"
  },
  {
      "subsubcomponent_ID": "17",
      "subsubcomponent_title": "Pelaksanaan Penyaluran Transfer Ke Daerag dan Dana Desa",
      "component_ID": "3",
      "subcomponent_ID": "13"
  },
  {
      "subsubcomponent_ID": "18",
      "subsubcomponent_title": "Evaluasi DAK Fisik dan Dana Desa",
      "component_ID": "3",
      "subcomponent_ID": "13"
  },
  {
      "subsubcomponent_ID": "19",
      "subsubcomponent_title": "Akurasi Data Kredit Program",
      "component_ID": "3",
      "subcomponent_ID": "14"
  },
  {
      "subsubcomponent_ID": "20",
      "subsubcomponent_title": "Survei Lapangan Debitur",
      "component_ID": "3",
      "subcomponent_ID": "14"
  }
]

interface SubSubKomponenRefProps {
  section: number,
  addState: boolean,
  resetAddState: () => void,
};
//------------------------------------------------------------------------------------
export default function SubSubKomponenRef({section, addState, resetAddState}: SubSubKomponenRefProps) {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false); // for edit modal

  const [editID, setEditID] = useState<number | null>(null);

  const handleOpen = (id: number) => {
    setOpen(true);
    setEditID(id);
  };

  const handleClose = () => {
    setOpen(false);
    resetAddState();
  };
  
  //set modal state utk add Data dan hide modal state buat nge edit
  useEffect(() => {
    if (addState && section===4) {
      setEditID(null);
      setOpen(true);
    }

  }, [addState, section]);

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
                    <TableSortLabel
                      hideSortIcon
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {TABLE_DATA2.map((row) => 
                <TableRow hover key={row.subsubcomponent_ID} tabIndex={-1}>
                  <TableCell align="justify">{row.subsubcomponent_ID}</TableCell>

                  <TableCell align="left">{row.subsubcomponent_title}</TableCell>

                  <TableCell align="left">{row.subcomponent_ID}</TableCell>

                  <TableCell align="left">
                    {row.component_ID}
                  </TableCell>

                  <TableCell align="center">{row.component_ID}</TableCell>

                  <TableCell align="justify">
                    <Stack direction='row' spacing={1}>
                      <Tooltip title='edit'>
                        <span>
                          <StyledButton 
                            aria-label="edit" 
                            variant='contained' 
                            size='small' 
                            color='warning'
                            onClick={() => handleOpen(parseInt(row.subsubcomponent_ID))}
                          >
                            <Iconify icon="solar:pen-bold-duotone"/>
                          </StyledButton>
                        </span>
                      </Tooltip>
                      <Tooltip title='delete'>
                        <span>
                          <StyledButton aria-label="delete" disabled variant='contained' size='small' color='white'>
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

      <SubSubKomponenRefModal 
        modalOpen={open} 
        modalClose={handleClose} 
        addState={addState}
        editID={editID}
        data={TABLE_DATA}
        /> 
    </>
  )
}

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

interface SubSubKomponenRefModalProps {
  modalOpen: boolean,
  modalClose: () => void,
  addState: boolean,
  editID: number | null,
  data: SubSubKomponenData[]
}


//----------------------------------------------------------------
function SubSubKomponenRefModal({modalOpen, modalClose, addState, editID, data}: SubSubKomponenRefModalProps) {
  const [addValue, setAddValue] = useState<SubSubKomponenData>({
    id: 0,
    subsubkomponen:'',
    subkomponen:0,
    komponen: 0,
  });

  const handleChangeAdd = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAddValue({
      ...addValue,
      [e.target.name]:e.target.value
    })
  };

  const handleResetAdd = () => {
    setAddValue({
      id: 0,
      subsubkomponen:'',
      subkomponen:0,
      komponen: 0,
    })
  };

  const [editValue, setEditValue] = useState<SubSubKomponenData>({
    id: 0,
    subsubkomponen:'',
    subkomponen:0,
    komponen: 0,
  });

  const handleChangeEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditValue({
      ...editValue,
      [e.target.name]:e.target.value
    })
  };

  const handleResetEdit = () => {
    setEditValue({
      id: data.filter((row) => row.id===editID)[0].id,
      subsubkomponen: data.filter((row) => row.id===editID)[0].subsubkomponen,
      subkomponen: data.filter((row) => row.id===editID)[0].subkomponen,
      komponen: data.filter((row) => row.id===editID)[0].komponen,
    })
  };

  useEffect(() => {
    if(data && editID){
      setEditValue({
        id: data.filter((row) => row.id===editID)[0].id,
        subsubkomponen: data.filter((row) => row.id===editID)[0].subsubkomponen,
        subkomponen: data.filter((row) => row.id===editID)[0].subkomponen,
        komponen: data.filter((row) => row.id===editID)[0].komponen,
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
                Sub Komponen
              </Typography>

                  <FormDataContainer>
                    <Stack direction='row' spacing={2} sx={{width:'100%'}} justifyContent={'start'}>
                      <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                        <FormControl>
                          <StyledTextField 
                            name="subkomponen" 
                            label="Nama Sub Sub Komponen"
                            multiline
                            minRows={2}
                            value={ addState? addValue.subsubkomponen : editValue.subsubkomponen}
                            onChange={addState? handleChangeAdd : handleChangeEdit}
                          />
                        </FormControl>

                      </Stack>
                      <Stack direction='column' spacing={3} sx={{width:'45%'}}>
                        <FormControl>
                          <InputLabel id="komponen-select-label" sx={{typography:'body2'}}>Komponen</InputLabel>
                          <Select 
                            name="komponen" 
                            label='Komponen'
                            labelId="komponen-select-label"
                            value={addState? addValue.komponen : editValue.komponen}
                            sx={{typography:'body2', fontSize:14, height:'100%'}}
                          >
                            <MenuItem key={0} sx={{fontSize:14}} value={0}>Treasurer</MenuItem>
                            <MenuItem key={1} sx={{fontSize:14}} value={1}>Pengelola Fiskal Representasi Kemenkeu di Daerah</MenuItem>
                            <MenuItem key={2} sx={{fontSize:14}} value={2}>Financial Advisor</MenuItem>
                            <MenuItem key={3} sx={{fontSize:14}} value={3}>Tata Kelola Internal</MenuItem>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <InputLabel id="subkomponen-select-label" sx={{typography:'body2'}}>Sub Komponen</InputLabel>
                          <Select 
                            name="subkomponen" 
                            label='Sub Komponen'
                            labelId="subkomponen-select-label"
                            value={addState? addValue.subkomponen : editValue.subkomponen}
                            sx={{typography:'body2', fontSize:14, height:'100%'}}
                          >
                            <MenuItem key={0} sx={{fontSize:14}} value={0}>Sub Komponen A</MenuItem>
                            <MenuItem key={1} sx={{fontSize:14}} value={1}>Sub Komponen B</MenuItem>
                            <MenuItem key={2} sx={{fontSize:14}} value={2}>Sub Komponen C</MenuItem>
                            <MenuItem key={3} sx={{fontSize:14}} value={3}>Sub Komponen D</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>
                    </Stack>

                    <Stack sx={{width:'100%', pr:3, mt:1}} direction='row' spacing={2} flex={'row'} justifyContent={'end'}>
                      <Button 
                        variant='contained'
                        color={addState? 'primary' : 'warning'} 
                        sx={{borderRadius:'8px'}}
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
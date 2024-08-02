import {useState,  useMemo} from'react';
import {Stack, Typography, Table, IconButton, TableSortLabel,
  Tooltip, TableHead,  TableBody, TableRow, TableCell, TableContainer} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import Label from '../../../../components/label';
import Scrollbar from '../../../../components/scrollbar';
import { VisuallyHiddenInput, getComparator, applySortFilter } from './utils';
import StyledButton from '../../../../components/styledButton/StyledButton';
import ChecklistOpsiModal from './ChecklistOpsiModal';
import useLoading from '../../../../hooks/display/useLoading';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useChecklist from './useChecklist';
//----------------------------------------------------
interface ChecklistType{
  id: number,
  title: string, 
  header: string | null,
  komponen_id: number,
  subkomponen_id: number | null,
  subsubkomponen_id: number | number,
  standardisasi: number | null, 
  matrix_title: string | null, 
  file1: string | null,
  file2: string | null,
  opsi: OpsiType[] | null
};

interface OpsiType{
  id: number,
  title: string, 
  value: number,
  checklist_id: number
};

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'checklist', label: 'Judul Checklist', alignRight: false },
  { id: 'kriteria', label: 'Header', alignRight: false },
  { id: 'opsi', label: 'Opsi', alignRight: false },
  { id: 'dokumen', label: 'Contoh Dokumen', alignRight: false },
  { id: 'standardisasiKPPN', label: 'Standardisasi KPPN', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

interface ChecklistRefTableProps {
  tab: 0 | 1 | 2 | 3 | 4, 
  handleOpen: (id: number)=>void,
  fileOpen: (id: number, option: 1 | 2) => void,
  setDeleteFile: React.Dispatch<React.SetStateAction<() => void>>,
  setFile: React.Dispatch<React.SetStateAction<string | null>>,
};

// ---------------------------------------------------
export default function ChecklistRefTable({tab, handleOpen, fileOpen, setDeleteFile, setFile}: ChecklistRefTableProps) {
  const theme = useTheme();

  const {isLoading, setIsLoading} = useLoading();

  const {openSnackbar} = useSnackbar();

  const {checklist, getChecklist} = useChecklist();

  const axiosJWT = useAxiosJWT();

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [orderBy, setOrderBy] = useState<string>('id');

  const filteredChecklist= applySortFilter(checklist, getComparator(order, orderBy), tab);

  const [open, setOpen] = useState<boolean>(false); // Opsi Modal

  const [editID, setEditID] = useState<number>(0); // Opsi Modal

  const [opsiID, setOpsiID] = useState<number>(0); // Opsi Modal

  const [addState, setAddState] = useState<boolean>(false); // Opsi Modal

  const handleClose = () => {  // Opsi Modal
    setOpen(false);
    setEditID(0);
  };

  const handleAddOpsi = () => {  // Opsi Modal
    setAddState(true);
    setOpen(true); 
  };

  const handleEditOpsi = (id: number, opsiID: number) => {
    setEditID(id);
    setOpsiID(opsiID);
    setAddState(false);
    setOpen(true);
  };

  const handleChangeFile = async(e: React.ChangeEvent<HTMLInputElement>, chID: number, option: number) => {
    e.preventDefault();
    if(!e.target.files){return}

    const selectedFile = e.target.files[0];
    let fileOption;

    if(option === 1){
      fileOption = 1;
    }else if(option === 2){
      fileOption = 2;
    };

    try{
      setIsLoading(true);
      const formData = new FormData();
      formData.append("id", chID.toString());
      formData.append("option", fileOption?.toString() || "1");
      formData.append("file", selectedFile);
      await axiosJWT.post(`/editChecklistFile`, formData, {
        headers:{"Content-Type": "multipart/form-data"}
      });
      await getChecklist();
      setIsLoading(false); 
    }catch(err: any){
      setIsLoading(false);
      openSnackbar(`Upload failed, ${err.response.data.message}`, "error");
    }finally{
      setIsLoading(false);
    }
  };


  return (
    <>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                {TABLE_HEAD.map((headCell, index) => (
                  <TableCell
                    key={headCell.id}
                    align={'center'}
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
              {useMemo(() => filteredChecklist?.map((row, index) => 
                <TableRow hover key={row.id} tabIndex={-1}>
                  <TableCell align="justify">{index+1}</TableCell>

                  <TableCell align="center" sx={{fontSize:12}}>{row.title}</TableCell>

                  <TableCell align="justify" sx={{fontSize:12}}>{row.header}</TableCell>

                  <TableCell align="center">
                    <Stack direction='row' spacing={1} alignContent="center" alignItems="center" justifyContent="center">
                      {row?.opsi?.map((item, index) => 
                        <Label
                          key={index} 
                          color={item.value===10?'success':item.value===0?'pink':'warning'} 
                          sx={{cursor: 'pointer'}} 
                          onClick={() => handleEditOpsi(row.id, item.id)}>
                          {item.value}
                        </Label>
                      )}

                      {/* <IconButton>
                        <Iconify sx={{color:theme.palette.grey[500]}} icon="solar:add-circle-bold"/>
                      </IconButton> */}
                    </Stack>
                  </TableCell>

                  <TableCell align="center" >
                    <Stack direction='row' spacing={0}>
                      <IconButton 
                        color='secondary' 
                        onClick={() => {fileOpen(row.id, 1); setFile(row.file1)}}  
                        sx={{display: row.file1?'block':'none'}}
                      >
                        <Iconify icon="solar:file-bold-duotone"/>
                      </IconButton>

                      <IconButton 
                        color='secondary' 
                        onClick={() => {fileOpen(row.id, 2); setFile(row.file2)}} 
                        sx={{display: row.file2?'block':'none'}}
                      >
                        <Iconify icon="solar:file-bold-duotone"/>
                      </IconButton>
                     
                      <IconButton 
                        component="label"
                        sx={{display: row.file1?'none':'block'}}
                      >
                        <Iconify 
                          sx={{color:theme.palette.grey[500]}} 
                          icon="solar:add-circle-bold"
                        />
                        <VisuallyHiddenInput 
                        type='file'
                        accept='image/*,.pdf,.zip' 
                        onChange={(e) => handleChangeFile(e, row.id, 1)} 
                      />
                      </IconButton>

                       <IconButton 
                        component="label"
                        sx={{display: row.file2?'none':'block'}}
                      >
                        <Iconify 
                          sx={{color:theme.palette.grey[500]}} 
                          icon="solar:add-circle-bold"
                        />
                        <VisuallyHiddenInput 
                        type='file'
                        accept='image/*,.pdf,.zip' 
                        onChange={(e) => handleChangeFile(e, row.id, 2)} 
                      />
                      </IconButton>
                    </Stack>
                  </TableCell>

                  <TableCell align="center" sx={{fontSize:12}}>
                    {row.standardisasi===1?'Ya':'Tidak'}
                  </TableCell>

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
                          <StyledButton aria-label="delete" disabled variant='contained' size='small' color='white'>
                            <Iconify icon="solar:trash-bin-trash-bold"/>
                          </StyledButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell> 
                </TableRow>
              ), [checklist, tab])}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <ChecklistOpsiModal
        modalOpen={open}
        modalClose={handleClose}
        editID={editID}
        checklist= {checklist?.filter((row) => row.id===editID)?.map((row) => {return {...row}})}
        opsi={checklist?.filter((row) => row.id===editID)?.flatMap((row) => row.opsi || [])}
        opsiID={opsiID}
      />
    </>
  )
}
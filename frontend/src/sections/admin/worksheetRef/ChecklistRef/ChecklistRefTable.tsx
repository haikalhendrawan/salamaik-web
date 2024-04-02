import {useState, useEffect, useRef} from'react';
import {Stack, Button, Box, Typography, Table, Card, Modal, FormControl, Paper, InputLabel, TableSortLabel,
  Tooltip, TableHead, Grow, TableBody, TableRow, TableCell, Select, MenuItem, Tabs, Tab, TableContainer} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import Label from '../../../../components/label';
import Scrollbar from '../../../../components/scrollbar';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import StyledButton from '../../../../components/styledButton/StyledButton';
import ChecklistOpsiModal from './ChecklistOpsiModal';
//----------------------------------------------------
interface OpsiData{
  opsiID: number,
  checklistID: number,
  opsiTitle: string,
  opsiValue: number
};

const OPSI_DATA: OpsiData[] = [
  { opsiID:0, checklistID:0, opsiTitle:'Title 1', opsiValue:10},
  { opsiID:1, checklistID:1, opsiTitle:'Title 2', opsiValue:5},
  { opsiID:2, checklistID:2, opsiTitle:'Title 3', opsiValue:3},
  { opsiID:3, checklistID:3, opsiTitle:'Title 4', opsiValue:1},
  { opsiID:4, checklistID:4, opsiTitle:'Title 4', opsiValue:1},
];

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'checklist', label: 'Judul Checklist', alignRight: false },
  { id: 'kriteria', label: 'Header Kriteria', alignRight: false },
  { id: 'opsi', label: 'Opsi', alignRight: false },
  { id: 'dokumen', label: 'Contoh Dokumen', alignRight: false },
  { id: 'standardisasiKPPN', label: 'Standardisasi KPPN', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

interface ChecklistData{
  id: number,
  checklist:string,
  kriteria:string,
  standardisasiKPPN:boolean,
  subsubkomponen:number,
  subkomponen: number,
  komponen:number,
  numChecklist?: number,
};

interface ChecklistRefTableProps {
  tableData: ChecklistData[],
  handleOpen: (id: number)=>void,
  fileOpen: () => void
};

// ---------------------------------------------------
export default function ChecklistRefTable({tableData, handleOpen, fileOpen}: ChecklistRefTableProps) {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false); // Opsi Modal

  const [editID, setEditID] = useState<number>(0); // Opsi Modal

  const [addState, setAddState] = useState<boolean>(false); // Opsi Modal

  const handleClose = () => {  // Opsi Modal
    setOpen(false);
    setEditID(0);
  };

  const handleAddOpsi = () => {  // Opsi Modal
    setAddState(true);
    setOpen(true); 
  };

  const handleEditOpsi = (id: number) => {
    setEditID(id);
    setAddState(false);
    setOpen(true);
  }

  return (
    <>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                {TABLE_HEAD.map((headCell) => (
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
              {tableData.map((row) => 
                <TableRow hover key={row.id} tabIndex={-1}>
                  <TableCell align="justify">{row.id}</TableCell>

                  <TableCell align="center" sx={{fontSize:12}}>{row.checklist}</TableCell>

                  <TableCell align="justify" sx={{fontSize:12}}>{row.kriteria}</TableCell>

                  <TableCell align="center" sx={{width:'10%'}}>
                    <Stack direction='row' spacing={1}>
                      <StyledButton aria-label="10" variant='contained' size='small' color='success' onClick={() => handleEditOpsi(row.id)}>
                        10
                      </StyledButton>

                      <StyledButton aria-label="7" variant='contained' size='small' color='warning' onClick={() => handleEditOpsi(row.id)}>
                        7
                      </StyledButton>

                      {/* <StyledButton aria-label="5" variant='contained' size='small' color='warning' onClick={handleAddOpsi}>
                        5
                      </StyledButton> */}

                      <StyledButton aria-label="5" variant='contained' size='small' color='pink' onClick={() => handleEditOpsi(row.id)}>
                        0
                      </StyledButton>

                      <StyledButton aria-label="5" variant='contained' size='small' color='white' onClick={() => handleEditOpsi(row.id)}>
                        <Iconify icon="solar:add-circle-bold-duotone"/>
                      </StyledButton>
                    </Stack>
                  </TableCell>

                  <TableCell align="center" >
                    <Stack direction='row' spacing={1}>
                      <StyledButton 
                        aria-label="10" 
                        variant='contained' 
                        size='small' 
                        color='secondary'
                        onClick={fileOpen}
                      >
                        <Iconify icon="solar:file-bold-duotone"/>
                      </StyledButton>

                      {/* <StyledButton aria-label="7" variant='contained' size='small' color='secondary'>
                        <Iconify icon="solar:file-bold-duotone"/>
                      </StyledButton> */}

                      <StyledButton aria-label="5" variant='contained' size='small' color='white'>
                        <Iconify icon="solar:add-circle-bold-duotone"/>
                      </StyledButton>
                    </Stack>
                  </TableCell>

                  <TableCell align="center" sx={{fontSize:12}}>
                    {row.standardisasiKPPN?'Ya':'Tidak'}
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
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <ChecklistOpsiModal
        modalOpen={open}
        modalClose={handleClose}
        addState={addState}
        editID={editID}
        data={OPSI_DATA}
      />
    </>
  )
}
import {useState, useEffect, useRef} from'react';
import {Stack, Button, Box, Typography, Table, Card, Modal, FormControl, Paper, InputLabel, TableSortLabel,
  Tooltip, TableHead, Grow, TableBody, TableRow, TableCell, Select, MenuItem} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import Label from '../../../../components/label';
import Scrollbar from '../../../../components/scrollbar';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import StyledButton from '../../../../components/styledButton/StyledButton';
import BatchRefTable from './BatchRefTable';
import BatchRefModal from './BatchRefModal';
//----------------------------------------------------
interface BatchData{
  id: number,
  periodID: number,
  kppnID: number,
  kppnName: string,
  batchStatus: number,
  openPeriod: string,
  closePeriod: string
};

const TABLE_DATA: BatchData[] = [
  {id:1,periodID:0, kppnID:0, kppnName:'KPPN Padang', batchStatus:1, openPeriod: '01/05/2024', closePeriod: '31/05/2024'},
  {id:2,periodID:0, kppnID:1, kppnName:'KPPN Bukittinggi', batchStatus:1, openPeriod: '01/05/2024', closePeriod: '31/05/2024'},
  {id:3,periodID:0, kppnID:2, kppnName:'KPPN Solok', batchStatus:0 , openPeriod: '01/05/2024', closePeriod: '31/05/2024'},
  {id:4,periodID:0, kppnID:3, kppnName:'KPPN Lubuk Sikaping', batchStatus:1 , openPeriod: '01/05/2024', closePeriod: '31/05/2024'},
  {id:5,periodID:0, kppnID:4, kppnName:'KPPN Sijunjung', batchStatus:0 , openPeriod: '01/05/2024', closePeriod: '31/05/2024'},
  {id:6,periodID:0, kppnID:5, kppnName:'KPPN Painan', batchStatus:0 , openPeriod: '01/05/2024', closePeriod: '31/05/2024'},
];

interface BatchRefProps {
  section: number,
  addState: boolean,
  resetAddState: () => void,
};

export default function BatchRef({section, addState, resetAddState}: BatchRefProps) {
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
    if (addState && section===5) {
      setEditID(null);
      setOpen(true);
    }

  }, [addState, section]);


  return (
    <>
      <Grow in>
        <Card sx={{minHeight:480, display:'flex', flexDirection:'column', gap:theme.spacing(1)}}>
          <BatchRefTable
             tableData={TABLE_DATA}
             handleOpen={handleOpen}
          />
        </Card>
      </Grow>

      <BatchRefModal 
        modalOpen={open} 
        modalClose={handleClose} 
        addState={addState}
        editID={editID}
        data={TABLE_DATA}
      /> 
    </>
  )
}
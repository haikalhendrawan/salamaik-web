import {useState, useEffect, useRef} from'react';
import {Stack, Button, Box, Typography, Table, Card, Modal, FormControl, Paper, InputLabel, TableSortLabel,
  Tooltip, TableHead, Grow, TableBody, TableRow, TableCell, Select, MenuItem} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import Label from '../../../../components/label';
import Scrollbar from '../../../../components/scrollbar';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import StyledButton from '../../../../components/styledButton/StyledButton';
import PeriodRefTable from './PeriodRefTable';
import PeriodRefModal from './PeriodRefModal';
//----------------------------------------------------
interface PeriodData{
  id: number,
  periodName: string,
  startDate: string,
  endDate: string,
}

const TABLE_DATA: PeriodData[] = [
  {id:1, periodName:'Semester 1 2024', startDate:'01/01/2024', endDate:'31/06/2024'},
  {id:2, periodName:'Semester 2 2024', startDate:'01/01/2024', endDate:'31/06/2024'},
  {id:3, periodName:'Semester 3 2024', startDate:'01/01/2024', endDate:'31/06/2024'},
  {id:4, periodName:'Semester 4 2024', startDate:'01/01/2024', endDate:'31/06/2024'},
];

interface PeriodRefProps {
  section: number,
  addState: boolean,
  resetAddState: () => void,
};

export default function PeriodRef({section, addState, resetAddState}: PeriodRefProps) {
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
    if (addState && section===6) {
      setEditID(null);
      setOpen(true);
    }

  }, [addState, section]);


  return (
    <>
      <Grow in>
        <Card sx={{minHeight:480, display:'flex', flexDirection:'column', gap:theme.spacing(1)}}>
          <PeriodRefTable
             tableData={TABLE_DATA}
             handleOpen={handleOpen}
          />
        </Card>
      </Grow>

      <PeriodRefModal 
        modalOpen={open} 
        modalClose={handleClose} 
        addState={addState}
        editID={editID}
        data={TABLE_DATA}
      /> 
    </>
  )
}
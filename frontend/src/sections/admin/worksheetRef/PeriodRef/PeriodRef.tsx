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
import useDictionary from '../../../../hooks/useDictionary';
//----------------------------------------------------
interface DictionaryType {
  [key: string | number]: string | number | any[];
  list: any[];
};

interface PeriodType{
  id: number;
  name: string; 
  evenPeriod: 0;
  semester: number;
  tahun: string
};

interface PeriodRefProps {
  section: number,
  addState: boolean,
  resetAddState: () => void,
};

export default function PeriodRef({section, addState, resetAddState}: PeriodRefProps) {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false); // for edit modal

  const [editID, setEditID] = useState<number | null>(null);

  const { periodRef } = useDictionary();

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
             tableData={periodRef?.list || null}
             handleOpen={handleOpen}
          />
        </Card>
      </Grow>

      <PeriodRefModal 
        modalOpen={open} 
        modalClose={handleClose} 
        addState={addState}
        editID={editID}
        data={periodRef?.list || null}
      /> 
    </>
  )
}
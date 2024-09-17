/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState, useEffect} from'react';
import {Card, Grow} from '@mui/material';
import { useTheme} from '@mui/material/styles';
import PeriodRefTable from './PeriodRefTable';
import PeriodRefModal from './PeriodRefModal';
import useDictionary from '../../../../hooks/useDictionary';
//----------------------------------------------------
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
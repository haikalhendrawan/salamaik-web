/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState, useEffect} from'react';
import { Card, Grow} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BatchRefTable from './BatchRefTable';
import BatchRefModal from './BatchRefModal';
import useBatch from './useBatch';
/**
 *
 *
 * BatchRef
 * di Backend modul ini sebutannya WorksheetRef
 * fungsinya untuk membuat kertas kerja baru dan assign KK setiap ada penambahan periode pembinaan
 */
//----------------------------------------------------
interface BatchRefProps {
  section: number,
  addState: boolean,
  resetAddState: () => void,
};

export default function BatchRef({section, addState, resetAddState}: BatchRefProps) {
  const theme = useTheme();

  const { batch } = useBatch();

  const [open, setOpen] = useState<boolean>(false); // for edit modal

  const [editID, setEditID] = useState<string | null>(null);

  const handleOpen = (id: string) => {
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
             tableData={batch}
             handleOpen={handleOpen}
          />
        </Card>
      </Grow>

      <BatchRefModal 
        modalOpen={open} 
        modalClose={handleClose} 
        addState={addState}
        editID={editID}
        data={batch}
      /> 
    </>
  )
}
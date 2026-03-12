/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState, useEffect, useMemo, useCallback} from'react';
import { Card,  Grow, Tabs, Tab} from '@mui/material';
import { useTheme} from '@mui/material/styles';
import Label from '../../../../components/label';
import ChecklistRefTable from './ChecklistRefTable';
import ChecklistRefModal from './ChecklistRefModal';
import ChecklistFileModal from './ChecklistFileModal';
import useChecklist from './useChecklist';
import useDictionary from '../../../../hooks/useDictionary';
//---------------------------------------------------------------------------------------------
interface ChecklistRefProps {
  section: number,
  addState: boolean,
  resetAddState: () => void,
}
//--------------------------------------------------------------------------------------------
export default function ChecklistRef({section, addState, resetAddState}: ChecklistRefProps) {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false); // for edit modal

  const [editID, setEditID] = useState<number | null>(null); // for edit modal

  const [openFile, setOpenFile] = useState<boolean>(false); // for preview file modal

  const [file, setFile] = useState<string | null>(null); // for preview file modal

  const [fileOption, setFileOption] = useState<1 | 2>(1); //  opsi 1 untuk upload file 1 opsi 2 utk upload file 2

  const [tabValue, setTabValue] = useState<0 | 1 | 2 | 3 | 4>(0);

  const [pageLoading, setPageLoading] = useState<boolean>(true);

  const {checklist, getChecklist} = useChecklist();

  const {komponenRef} = useDictionary();

  const komponenCount = (id: number) => useMemo(() => checklist?.filter((item) => item.komponen_id === id).length, [checklist]);

  const allKomponenCount = useMemo(() => checklist?.length, [checklist]);

  const handleOpen = (id: number) => { // for edit modal
    setOpen(true);
    setEditID(id);
  };

  const handleClose = () => { // for edit modal
    setOpen(false);
    resetAddState();
  };

  const handleOpenFile = (id: number, option: 1 | 2) => {
    setOpenFile(true);
    setEditID(id);
    setFileOption(option);
  };

  const handleCloseFile = () => {
    setOpenFile(false)
    setEditID(null);
    setFileOption(1);
  };

  const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: 0 | 1 | 2 | 3 | 4) => {
    setTabValue(newValue);
  }, []);

  //set modal state utk add Data dan hide modal state buat nge edit
  useEffect(() => {
    if (addState && section===1) {
      setEditID(null);
      setOpen(true);
    }

  }, [addState, section]);

  useEffect(() => {
    async function getData(){
      try{
        await getChecklist();
        setPageLoading(false);
      }catch(err){
        setPageLoading(false);
      }
    }
    getData();
  }, [])

  return(
    <>
     <Grow in>
        <Card sx={{minHeight:480, display:'flex', flexDirection:'column', gap:theme.spacing(1)}}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            sx={{
              "& button.Mui-selected": { color: theme.palette.text.primary },
              "& .MuiTabs-flexContainer": {height:'48px',width:'721px'},
              "& button.MuiTab-root": {minHeight: 30},
            }}
            TabIndicatorProps={{ sx: {bgcolor: theme.palette.text.primary}}}
          > 
            <Tab 
              icon={<Label sx={{color: theme.palette.text.primary, cursor:'pointer'}}>{allKomponenCount}</Label>} 
              label="all"
              iconPosition="end"  
              value={0} 
            />
          {
            komponenRef?.map((item) => (
              <Tab 
              icon={<Label sx={{color: theme.palette.text.primary, cursor:'pointer'}}>{komponenCount(item.id)}</Label>} 
              label={item.title} 
              iconPosition="end"  
              value={item.id} 
              />
            ))
          }
          </Tabs>
          {pageLoading 
            ? 
              null 
            :  
              <ChecklistRefTable
                tab={tabValue} 
                handleOpen={handleOpen}
                fileOpen={handleOpenFile}
                setDeleteFile={() => {}}
                setFile={setFile}
              />
          }
         
        </Card>
      </Grow>

      {pageLoading 
        ? 
          null 
        :
          <>      
            <ChecklistRefModal 
              modalOpen={open} 
              modalClose={handleClose} 
              addState={addState}
              editID={editID}
            /> 

            <ChecklistFileModal
              open={openFile}
              modalClose={handleCloseFile}
              fileName={file}
              editID={editID}
              fileOption={fileOption}
            />
          </>
      }


    </>
  )
}

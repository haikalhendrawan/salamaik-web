import {useState, useEffect, useMemo, useCallback} from'react';
import { Card,  Grow, Tabs, Tab} from '@mui/material';
import { useTheme} from '@mui/material/styles';
import Label from '../../../../components/label';
import ChecklistRefTable from './ChecklistRefTable';
import ChecklistRefModal from './ChecklistRefModal';
import ChecklistFileModal from './ChecklistFileModal';
import useChecklist from './useChecklist';
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

  const komponen1Count = useMemo(() => checklist?.filter((item) => item.komponen_id === 1).length, [checklist]);
  
  const komponen2Count = useMemo(() => checklist?.filter((item) => item.komponen_id === 2).length, [checklist]);
  
  const komponen3Count = useMemo(() => checklist?.filter((item) => item.komponen_id === 3).length, [checklist]);
  
  const komponen4Count = useMemo(() => checklist?.filter((item) => item.komponen_id === 4).length, [checklist]);
  
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
              label="All" 
              iconPosition="end"  
              value={0} 
            />
            <Tab 
              icon={<Label color={'primary'} sx={{cursor:'pointer'}}>{komponen1Count}</Label>} 
              label="Treasurer" 
              iconPosition="end"  
              value={1} 
            />
            <Tab 
              icon={<Label color={'primary'} sx={{cursor:'pointer'}}>{komponen2Count}</Label>} 
              label="Pengelola Fiskal, Representasi Kemenkeu di Daerah, dan Special Mission" 
              iconPosition="end"  
              value={2} 
            />
            <Tab 
              icon={<Label color={'primary'} sx={{cursor:'pointer'}}>{komponen3Count}</Label>} 
              label="Financial Advisor" 
              iconPosition="end"  
              value={3} 
            />
            <Tab 
              icon={<Label color={'primary'} sx={{cursor:'pointer'}}>{komponen4Count}</Label>} 
              label="Tata Kel. Internal" 
              iconPosition="end"  
              value={4} 
            />
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

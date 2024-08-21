/**
 * @Section param
 * 0: landing
 * 1: checklist
 * 2: komponen
 * 3: Subkomponen
 * 4: Sub sub komponen
 * 5: batch
 * 6: periode
 */

import {useState} from'react';
import {Container, Stack, Button, Typography, Grid, IconButton, Breadcrumbs, Link} from '@mui/material';
import Iconify from '../../components/iconify';
import WorksheetRefLanding from "../../sections/admin/worksheetRef/WorksheetRefLanding";
import ChecklistRef from '../../sections/admin/worksheetRef/ChecklistRef';
import KomponenRef from '../../sections/admin/worksheetRef/KomponenRef';
import SubKomponenRef from '../../sections/admin/worksheetRef/SubKomponenRef';
import SubSubKomponenRef from '../../sections/admin/worksheetRef/SubSubKomponenRef';
import BatchRef from '../../sections/admin/worksheetRef/BatchRef';
import PeriodRefSection from '../../sections/admin/worksheetRef/PeriodRef';
import { ChecklistProvider } from '../../sections/admin/worksheetRef/ChecklistRef/useChecklist';
import { BatchProvider } from '../../sections/admin/worksheetRef/BatchRef/useBatch';
import { DialogProvider } from '../../hooks/display/useDialog';
//----------------------------------------------------

export default function WorksheetRefPage() {
  const [section, setSection] = useState<number>(0);

  const [addState, setAddState] = useState<boolean>(false); 
  // seluruh child komponen cuma menampilkan bagian bawah, 
  // utk tombol add dihandle dari komponen ini sehingga perlu track dari statenya
  //secondly, kita cuma pakai 1 modal utk add dan edit, sehingga contentnya berubah setiap state ini berubah

  const resetAddState = () => {
    setAddState(false);
  };

  const handleChangeSection = (section: number) => {
    setSection(section);
    window.scrollTo(0, 0); // scroll ke atas setiap change section
  };

  const SELECT_SECTION: JSX.Element[] = [
    <WorksheetRefLanding changeSection={handleChangeSection} />,
    <ChecklistProvider>
      <ChecklistRef section={section} addState={addState} resetAddState={resetAddState} />
    </ChecklistProvider>,
    <KomponenRef section={section} addState={addState} resetAddState={resetAddState} />,
    <SubKomponenRef section={section} addState={addState} resetAddState={resetAddState} />,
    <SubSubKomponenRef section={section} addState={addState} resetAddState={resetAddState} />,
    <BatchProvider>
      <BatchRef section={section} addState={addState} resetAddState={resetAddState} />
    </BatchProvider>,
    <PeriodRefSection section={section} addState={addState} resetAddState={resetAddState} />,
  ];

  const SECTION_NAME: string[] = [
    'Ref Kertas Kerja',
    'Checklist',
    'Komponen',
    'Sub Komponen',
    'Sub Sub Komponen',
    'Kertas Kerja',
    'Periode',
  ];


  return (
    <>
      <Container maxWidth='xl'>
        <Stack direction="column" justifyContent="space-between" sx={{mb: 5}}>
          <Stack direction='row' spacing={1} alignItems="center">
            <IconButton 
              sx={{display:section===0?'none':'flex'}} 
              onClick={() => handleChangeSection(0)}
            >
              <Iconify icon={"eva:arrow-ios-back-outline"} />
            </IconButton> 
            <Typography variant="h4" gutterBottom>
              {SECTION_NAME[section]}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{display:section===0?'none':'flex'}}>
            <Stack direction='row' spacing={2} sx={{ml:6}}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link 
                  underline="hover" 
                  color="inherit" 
                  sx={{cursor:'pointer'}} 
                  onClick={() => handleChangeSection(0)}
                >
                  Ref Kertas Kerja
                </Link>
                <Typography color="text.primary">
                  {SECTION_NAME[section]}
                </Typography>
              </Breadcrumbs>
            </Stack>
            <Button 
              variant="contained"
              disabled={section===1 || section ===5 || section ===6? false : true} 
              startIcon={<Iconify icon="eva:plus-fill" />} 
              onClick={() => setAddState(true)}
            >
              Add
            </Button>
          </Stack>
        </Stack>
        

        <Grid item xs={12} sm={12} md={12}>
          <DialogProvider>
            {SELECT_SECTION[section]}
          </DialogProvider>
        </Grid>

      </Container>
    </>
  );
};
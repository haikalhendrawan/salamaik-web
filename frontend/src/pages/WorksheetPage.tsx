import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import Iconify from '../components/iconify/Iconify';
import ScrollToTopButton from '../components/scrollToTopButton/ScrollToTopButton';
//sections
import WorksheetInfo from '../sections/worksheet/component/WorksheetInfo';
import WorksheetCard from '../sections/worksheet/component/WorksheetCard';
import PreviewFileModal from '../components/previewFileModal/PreviewFileModal';
import InstructionPopover from '../sections/worksheet/component/InstructionPopover';
// @mui
import { Container, Stack, Typography, Box, Button, Tabs, Tab, Grid, Fab} from '@mui/material';


// ----------------------------------------------------------------------

export default function WorksheetPage() {
  const [tabValue, setTabValue] = useState(0); // ganti menu komponen supervisi

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => { // setiap tab komponen berubah
    setTabValue(newValue);
  };

  const [open, setOpen] = useState<boolean>(false); // for preview file modal

  const [file, setFile] = useState<string | undefined>('https://jdih.kemenkeu.go.id/download/a321969c-4ce0-4073-81ce-df35023750b1/PER_1_PB_2023-Perubahan%20Atas%20PERDIRJEN%20No.PER-24_PB_2019%20tentang%20Pedoman%20Pembinaan%20&%20Supervisi%20Pelaksanaan%20Tugas%20KPPN.pdf'); // for preview file modal

  const handleOpenFile = () => {
    setOpen(true);
  };

  const handleCloseFile = () => {
    setOpen(false)
  };

  const [openInstruction, setOpenInstruction] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement | null>(null);

  const handleOpenInstruction = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setOpenInstruction(true);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseInstruction = () => {
    setOpenInstruction(false)
  };


  return (
    <>
      <Helmet>
        <title> Salamaik | Worksheet</title>
      </Helmet>

      <Container>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Kertas Kerja
          </Typography>

          <Stack direction="row" alignItems="center" justifyContent="center " mb={5} >
            <Tabs value={tabValue} onChange={handleTabChange}> 
              <Tab icon={<Iconify icon="solar:safe-2-bold-duotone" />} label="Treasurer" value={0} />
              <Tab icon={<Iconify icon="solar:buildings-2-bold-duotone" />} label="PF, RKDD, SM" value={1} />
              <Tab icon={<Iconify icon="solar:wallet-money-bold" />} label="Financial Advisor" value={2} />
              <Tab icon={<Iconify icon="solar:incognito-bold-duotone" />} label="Tata Kelola Internal" value={3} />
            </Tabs>
          </Stack>

          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <Grid container spacing={2}>
                <WorksheetCard 
                  id={1} 
                  title={'Akurasi RPD Harian Satker secara semesteran'} 
                  description={`Berdasarkan tingkat deviasi RPD dari aplikasi MonSAKTI/OMSPAN pada Modul Renkas: <br/><br/>
                  <b>-Nilai 10</b>:
                  Nilai Deviasi antara 0 s.d. 1,99%<br/>
                  <b>-Nilai 7</b>:
                  Nilai Deviasi antara 2% s.d. 5% <br/>
                  <b>-Nilai 5</b>:
                  Nilai Deviasi antara 5% s.d. 10% <br/>
                  <b>-Nilai 0</b>:
                  Nilai deviasi lebih dari 10%`}
                  num={1}
                  dateUpdated={new Date()}
                  modalOpen={handleOpenFile}
                  modalClose={handleCloseFile}
                  file={file}
                  openInstruction={handleOpenInstruction}
                />
                <WorksheetCard 
                  id={2} 
                  title={'Upaya meminimalisir terjadinya deviasi RPD pada Satker'} 
                  description={`Berdasarkan data Satker yang belum merealisasikan anggarannya mendekati akhir bulan, Melakukan konfirmasi kepada KPPN terkait upaya pencegahan deviasi tersebut
                  <br/><br/>
                  <b>-Nilai 10</b>:  apabila ada upaya peminimalisiran atas deviasi (misal surat pemberitahuan ke Satker, rekapitulasi monitoring realisasi anggaran di tiap bulan atau
                    dilakukannya bimbingan/konsultasi kepada satker, dan ada dokumen pembuktian/pendukung yang jelas) <br/> <br/>
                    <b>-Nilai 5</b>: apabila ada upaya peminimalisiran deviasi, namun tidak ditemukan dokumen pembuktian/pendukung<br/> <br/>
                    <b>-Nilai 0</b>: Tidak ada keterangan dari KPPN yang mampu menunjukan upaya peminimalisiran<br/> <br/>`}
                  num={2}
                  dateUpdated={new Date()}
                  modalOpen={handleOpenFile}
                  modalClose={handleCloseFile}
                  file={file}
                  openInstruction={handleOpenInstruction}
                />
              </Grid>
            </Grid>
            {/* <Grid item xs={12} md={4}>
              <WorksheetInfo />
            </Grid> */}
          </Grid>

      </Container>

      <PreviewFileModal open={open} modalClose={handleCloseFile} file={file} />

      <InstructionPopover open={openInstruction} anchorEl={anchorEl} handleClose={handleCloseInstruction} />

      <ScrollToTopButton />
    </>
  );
}

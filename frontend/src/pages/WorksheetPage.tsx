import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import Iconify from '../components/iconify/Iconify';
import LinearProgressWithLabel from '../components/linear-progress-with-label/LinearProgressWithLabel';
//sections
import WorksheetInfo from '../sections/worksheet/component/WorksheetInfo';
import WorksheetCard from '../sections/worksheet/component/WorksheetCard';
// @mui
import { Container, Stack, Typography, Box, Button, Tabs, Tab, Grid } from '@mui/material';


// ----------------------------------------------------------------------

export default function WorksheetPage() {
  const [tabValue, setTabValue] = useState(0); // ganti menu komponen supervisi

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => { // setiap tab komponen berubah
    setTabValue(newValue);
  };

  const override=  {
    display: "block",
    margin: "0 auto",
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
              <Tab icon={<Iconify icon="lucide:briefcase-business" />} label="Treasurer" value={0} />
              <Tab icon={<Iconify icon="lucide:castle" />} label="PF, RKKD, SM " value={1} />
              <Tab icon={<Iconify icon="lucide:badge-dollar-sign" />} label="Financial Advisor" value={2} />
              <Tab icon={<Iconify icon="lucide:tower-control" />} label="Tata Kelola Internal" value={3} />
              {/* <Tab icon={<Iconify icon="material-symbols:send" />} label="Kirim" value={4} /> */}
            </Tabs>
          </Stack>

          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
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
                />
                <WorksheetCard 
                  id={2} 
                  title={'Upaya meminimalisir terjadinya deviasi RPD pada Satker'} 
                  description={`Berdasarkan data Satker yang belum merealisasikan anggarannya mendekati akhir bulan, Melakukan konfirmasi kepada KPPN terkait upaya pencegahan deviasi tersebut
                  <br/><br/>
                  <b>-Nilai 10</b>:  apabila ada upaya peminimalisiran atas deviasi (misal surat pemberitahuan ke Satker, rekapitulasi monitoring realisasi anggaran di tiap bulan atau
                    dilakukannya bimbingan/konsultasi kepada satker, dan ada dokumen pembuktian/pendukung yang jelas) <br/>
                    <b>-Nilai 5</b>: apabila ada upaya peminimalisiran deviasi, namun tidak ditemukan dokumen pembuktian/pendukung<br/>
                    <b>-Nilai 0</b>: Tidak ada keterangan dari KPPN yang mampu menunjukan upaya peminimalisiran<br/>`}
                  num={1}
                  dateUpdated={new Date()}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <WorksheetInfo />
            </Grid>
          </Grid>
          

          
          
      </Container>
    </>
  );
}

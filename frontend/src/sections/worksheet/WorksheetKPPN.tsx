import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Iconify from '../../components/iconify';
import PreviewFileModal from '../../components/previewFileModal/PreviewFileModal';
//sections
import WorksheetCard from './component/WorksheetCard';
import InstructionPopover from './component/InstructionPopover';
import NavigationDrawer from "./component/NavigationDrawer";
// @mui
import { Container, Stack, Typography, Tabs, Tab, Grid, Paper, 
        IconButton, Breadcrumbs, Link} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
// -----------------------------------------------------------------------
const SubkomponenDivider = styled(Paper)(({theme}) => ({
  padding: theme.spacing(1),
  paddingRight: theme.spacing(2),
  backgroundColor: theme.palette.grey[200],
  maxWidth: 'fit-content',
  color: theme.palette.primary.dark,
  borderRadius: '16px',
  fontWeight: '600',
  fontSize: '0.875rem',
}));

const SELECT_KPPN: {[key: string]: string} = {
  '010': 'Padang',
 '011': 'Bukittinggi',
 '090': 'Solok',
 '091': 'Lubuk Sikaping',
 '077': 'Sijunjung',
 '142': 'Painan',
};

// ----------------------------------------------------------------------

export default function WorksheetKPPN() {
  const theme = useTheme();

  const navigate = useNavigate();

  const params = new URLSearchParams(useLocation().search);
  
  const id= params.get('id');

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
        <Stack direction="column" justifyContent="space-between" sx={{mb: 5}}>
          <Stack direction='row' spacing={1} alignItems="center">
            <IconButton  
              onClick={() => navigate(-1)}
            >
              <Iconify icon={"eva:arrow-ios-back-outline"} />
            </IconButton> 
            <Typography variant="h4" >
              {`KPPN ${id!==null ? SELECT_KPPN[id]:null}`}
            </Typography>
          </Stack>

        </Stack>

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
              <Grid item xs={12} sm={12} md={12}>
                <Stack direction='row'>
                  <SubkomponenDivider>
                    Subkomponen : Pemantauan dan Evaluasi Kinerja Anggaran Satker dan Reviu Pelaksanaan Anggaran Satker K/L dan BLU
                  </SubkomponenDivider>

                  {/* <IconButton aria-label="edit" size='small' color='primary'>
                    <Iconify icon="solar:round-arrow-up-bold"/>
                  </IconButton>

                  <IconButton aria-label="edit" size='small' color='primary'>
                    <Iconify icon="solar:round-arrow-down-bold"/>
                  </IconButton> */}
                </Stack>
              </Grid>
              
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

              <Grid item xs={12} sm={12} md={12}>
                <Stack direction='row'>
                  <SubkomponenDivider>
                    Subkomponen : Penyaluran Belanja atas Beban APBN
                  </SubkomponenDivider>

                  {/* <IconButton aria-label="edit" size='small' color='primary'>
                    <Iconify icon="solar:round-arrow-up-bold"/>
                  </IconButton>

                  <IconButton aria-label="edit" size='small' color='primary'>
                    <Iconify icon="solar:round-arrow-down-bold"/>
                  </IconButton> */}
                </Stack>
              </Grid>

              <WorksheetCard 
                id={3} 
                title={'Prosedur Penerbitan SP2D'} 
                description={`Berdasarkan 10 uji sampling pelaksanaan SOP Penerbitan SP2D
                  <br/><br/>
                  <b>-Nilai 10</b>:  tidak ada penyimpangan/ketidaksesuaian dengan prosedur dalam SOP Penerbitan SP2D <br/> <br/>
                  <b>-Nilai 7</b>: ditemukan penyimpangan prosedur SOP Penerbitan SP2D, maksimal 1 langkah prosedur (ada pertimbangan KPPN kenapa ketidaksesuaian terjadi)<br/> <br/>
                  <b>-Nilai 5</b>: ditemukan ketidaksesuaian Prosedur SOP Penerbitan SP2D 1 s.d. 5 langkah prosedur<br/> <br/>
                  <b>-Nilai 0</b>: ditemukan ketidaksesuaian Prosedur SOP Penerbitan SP2D lebih dari 5 langkah prosedur<br/> <br/>`}
                num={3}
                dateUpdated={new Date()}
                modalOpen={handleOpenFile}
                modalClose={handleCloseFile}
                file={file}
                openInstruction={handleOpenInstruction}
              />
              <WorksheetCard 
                id={4} 
                title={'Ketepatan waktu penyelesaian tagihan'} 
                description={`Terhadap penyelesaian tagihan yang telah menjadi SP2D, memastikan bahwa KPPN melakukan proses penerbitan SP2D sesuai dengan Tata Cara Pembayaran APBN
                  <br/><br/>
                  <b>-Nilai 10</b>:  Penerbitan SP2D (dibawah jam 12 setempat) lebih dari satu jam berjumlah 0,1 s.d. 10% dari total SP2D <br/> <br/>
                  <b>-Nilai 7</b>:  Penerbitan SP2D (dibawah jam 12 setempat) lebih dari satu jam berjumlah 10% s.d. 25% dari total SP2D <br/> <br/>
                  <b>-Nilai 5</b>: Penerbitan SP2D (dibawah jam 12 setempat) lebih dari satu jam berjumlah 25% s.d. 50% dari total SP2D <br/> <br/>
                  <b>-Nilai 0</b>: Penerbitan SP2D (dibawah jam 12 setempat) berjumlah lebih dari  50% dari total SP2D <br/> <br/>`}
                num={4}
                dateUpdated={new Date()}
                modalOpen={handleOpenFile}
                modalClose={handleCloseFile}
                file={file}
                openInstruction={handleOpenInstruction}
              />
              <WorksheetCard 
                id={5} 
                title={'Upaya meminimalisir terjadinya deviasi RPD pada Satker'} 
                description={`Berdasarkan data Satker yang belum merealisasikan anggarannya mendekati akhir bulan, Melakukan konfirmasi kepada KPPN terkait upaya pencegahan deviasi tersebut
                <br/><br/>
                <b>-Nilai 10</b>:  apabila ada upaya peminimalisiran atas deviasi (misal surat pemberitahuan ke Satker, rekapitulasi monitoring realisasi anggaran di tiap bulan atau
                  dilakukannya bimbingan/konsultasi kepada satker, dan ada dokumen pembuktian/pendukung yang jelas) <br/> <br/>
                  <b>-Nilai 5</b>: apabila ada upaya peminimalisiran deviasi, namun tidak ditemukan dokumen pembuktian/pendukung<br/> <br/>
                  <b>-Nilai 0</b>: Tidak ada keterangan dari KPPN yang mampu menunjukan upaya peminimalisiran<br/> <br/>`}
                num={5}
                dateUpdated={new Date()}
                modalOpen={handleOpenFile}
                modalClose={handleCloseFile}
                file={file}
                openInstruction={handleOpenInstruction}
              />
            </Grid>
          </Grid>

        </Grid>

      </Container>

      <PreviewFileModal open={open} modalClose={handleCloseFile} file={file} />

      <InstructionPopover open={openInstruction} anchorEl={anchorEl} handleClose={handleCloseInstruction} />

      <NavigationDrawer />
    </>
  );
};


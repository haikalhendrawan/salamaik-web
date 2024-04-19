import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../components/iconify/Iconify';
// @mui
import {useTheme, styled, alpha} from '@mui/material/styles';
import {Button, IconButton, Container, Grid, Stack, Typography} from '@mui/material';
// sections
import FollowUpCard from './components/FollowUpCard';
import FollowUpHeader from './components/FollowUpHeader';

export default function FollowUpDetail() {
  const theme = useTheme();

  const navigate = useNavigate();

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
    <Container maxWidth="xl">
      <Stack direction="row" justifyContent="start" spacing={1} sx={{mb: 5}}>
        <IconButton  
          onClick={() => navigate(-1)}
        >
          <Iconify icon={"eva:arrow-ios-back-outline"} />
        </IconButton> 

        <Typography variant="h4" >
          {`Tindak Lanjut Masalah #1`}
        </Typography> 
      </Stack>
      


      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FollowUpHeader />
        </Grid>

        <Grid item xs={12}>
          <FollowUpCard 
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
        </Grid>
        
      </Grid>

    </Container>
    </>
  )

}
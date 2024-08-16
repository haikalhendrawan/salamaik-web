import { useState } from 'react';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Typography, Grid, Button, Box, Stack } from '@mui/material';
import { useAuth } from '../../../hooks/useAuth';
import PreviewFileModal from '../../../components/previewFileModal/PreviewFileModal';

// ----------------------------------------------------------------------
interface WelcomeCardProps {
  title: string;
  total: number;
  icon: string;
  color?: string;
  sx?: object;
};
// ----------------------------------------------------------------------

export default function WelcomeCard({ title, total, icon, color = 'primary', sx, ...other }: WelcomeCardProps) {
  const theme = useTheme();

  const {auth} = useAuth();

  const [file, setFile] = useState<string | undefined>('https://jdih.kemenkeu.go.id/download/a321969c-4ce0-4073-81ce-df35023750b1/PER_1_PB_2023-Perubahan%20Atas%20PERDIRJEN%20No.PER-24_PB_2019%20tentang%20Pedoman%20Pembinaan%20&%20Supervisi%20Pelaksanaan%20Tugas%20KPPN.pdf'); // for preview file modal
  
  const [open, setOpen] = useState<boolean>(false); // for preview file modal

  const handleOpenFile = () => {
    setOpen(true);
  };

  const handleCloseFile = () => {
    setOpen(false)
  };

  const primaryLight = theme.palette.primary.light;
  const primaryDark = theme.palette.primary.main;

  return (
    <>
      <Grid item sx={{pl:4, pr:4, borderRadius:'16px', background:`rgb(255, 255, 255) linear-gradient(135deg, ${alpha(primaryLight, 0.2)}, ${alpha(primaryDark, 0.2)})`, height:'300px'}}>
        <Stack direction='row'>
          <Stack direction={'column'} sx={{p:1, pb:5, pt:5, alignItems:'flex-start', textAlign:'left', width:'60%'}} spacing={3}>
            <Stack direction={'column'} spacing={0}>
              <Typography variant='h4' color={'primary.darker'}> Welcome, </Typography>
              <Typography variant='h5' color={'primary.darker'}> {auth?.name} </Typography>
            </Stack>

            <Typography variant='body2' color={'primary.darker'}> Aplikasi SALAMAIK (Self Assesment dan Penilaian Mandiri KPPN) </Typography>
            <Button variant='contained' onClick={handleOpenFile}>Panduan</Button>
          </Stack>

          <Stack direction={'row'}>
            <Box sx={{borderRadius:'16px', alignItems:'center', my:'auto' }}>
              <img src="/image/Other 11.png" style={{borderRadius:'12px', maxHeight:'300px'}} alt='welcome image'/>
            </Box>
          </Stack>
        </Stack> 
      </Grid>

      <PreviewFileModal open={open} modalClose={handleCloseFile} file={file} />
    </>


  );
}
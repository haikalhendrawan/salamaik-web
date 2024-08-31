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

const PANDUAN_FILE = [  
  {role: 0, file: 'panduan_user_kppn.pdf'},
  {role: 1, file: 'panduan_user_kppn.pdf'},
  {role: 2, file: 'panduan_admin_kppn.pdf'},
  {role: 3, file: 'panduan_user_kanwil.pdf'},
  {role: 4, file: 'panduan_admin_kanwil.pdf'},
  {role: 99, file: 'panduan_admin_kanwil.pdf'}, 
];

const baseUrl = import.meta.env.VITE_API_URL;
// ----------------------------------------------------------------------

export default function WelcomeCard({  }: WelcomeCardProps) {
  const theme = useTheme();

  const {auth} = useAuth();

  const file = (baseUrl+"/panduan/"+PANDUAN_FILE.filter((item) => item.role === auth?.role)[0]?.file) || 'panduan_user_kppn.pdf';
  
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
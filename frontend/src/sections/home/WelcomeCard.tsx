// @mui
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Card, Typography, Grid, Button, Box, Stack } from '@mui/material';
// utils

// components


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

  return (
      <Grid item spacing={1} sx={{pl:4, pr:4, borderRadius:'16px', backgroundColor:theme.palette.primary.lighter, height:'300px'}}>
        <Stack direction='row'>
          <Stack direction={'column'} sx={{p:1, pb:5, pt:5, alignItems:'flex-start', textAlign:'left', width:'60%'}} spacing={3}>
            <Stack direction={'column'} spacing={0}>
              <Typography variant='h4' color={'primary.darker'}> Welcome, </Typography>
              <Typography variant='h5' color={'primary.darker'}> Muhammad Haikal Putra H</Typography>
            </Stack>

            <Typography variant='body2' color={'primary.darker'}> Aplikasi SALAMAIK (Self Assesment dan Penilaian Mandiri KPPN) </Typography>
            <Button variant='contained'>Panduan</Button>
          </Stack>

          <Stack direction={'row'}>
            <Box sx={{borderRadius:'16px', alignItems:'center', my:'auto' }}>
              <img src="/image/sapiens.svg" style={{borderRadius:'12px', maxHeight:'300px'}} alt='abc'/>
            </Box>
          </Stack>
        </Stack> 
      </Grid>

  );
}
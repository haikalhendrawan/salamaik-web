import {useState, useEffect} from'react';
import { Link, useLocation } from 'react-router-dom';
// @mui
import { Card, CardHeader, Box, Button, Stack, CardContent, Typography } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import Iconify from '../../../components/iconify/Iconify';


// ----------------------------------------------------------------------

interface DasarHukumProps{
  title: string,
  subheader: string,
};

export default function MatrixGateway({ title, subheader, ...other }: DasarHukumProps) {
  const theme = useTheme();

  const primaryLight = theme.palette.primary.lighter;

  const primaryDark = theme.palette.primary.light;

  const kppn = new URLSearchParams(useLocation().search).get("id");

  return (
    <>
    <Card {...other} sx={{background:`rgb(255, 255, 255) linear-gradient(135deg, ${alpha(primaryLight, 0.2)}, ${alpha(primaryDark, 0.2)})`, height:'420px'}}>
      <CardHeader 
        title={<Typography variant="h6" sx={{color: theme.palette.grey[800]}}>{title}</Typography>} 
        subheader={subheader} 
      />

      <Box sx={{justifyContent:'center'}} dir="ltr" >
        <img src='/image/Other 03.png' style={{height:'290px', margin: 'auto', marginBottom:-20}} />
      </Box>

      <CardContent sx={{pt:0}}>
        <Stack direction='row'>
          <Button 
            variant='contained' 
            endIcon={<Iconify icon={'solar:book-2-bold-duotone'}/> }
            component={Link} 
            to={`/matrix/detail?id=${kppn}`}
          >
            Open
          </Button>
        </Stack>
      </CardContent>

    </Card>

    </>
  );
}
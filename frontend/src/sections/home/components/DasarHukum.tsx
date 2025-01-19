/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState} from'react';
// @mui
import { Card, CardHeader, Box, Button, Stack, CardContent, Typography } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import Iconify from '../../../components/iconify/Iconify';
import PreviewFileModal from '../../../components/previewFileModal/PreviewFileModal';


// ----------------------------------------------------------------------

interface DasarHukumProps{
  title: string,
  subheader: string,
};

export default function DasarHukum({ title, subheader, ...other }: DasarHukumProps) {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false); // for preview file modal

  const [file, _] = useState<string | undefined>(`${import.meta.env.VITE_API_URL}/peraturan/dasar_pembinaan.pdf`); // for preview file modal

  const handleOpenFile = () => {
    setOpen(true);
  };

  const handleCloseFile = () => {
    setOpen(false)
  };

  const primaryLight = theme.palette.primary.lighter;
  const primaryDark = theme.palette.primary.light;

  return (
    <>
    <Card {...other} sx={{background:`rgb(255, 255, 255) linear-gradient(135deg, ${alpha(primaryLight, 0.2)}, ${alpha(primaryDark, 0.2)})`, height:'420px'}}>
      <CardHeader 
        title={<Typography variant="h6" sx={{color: theme.palette.grey[800]}}>{title}</Typography>} 
        subheader={subheader} 
      />

      <Box sx={{justifyContent:'center'}} dir="ltr" >
        <img src='/image/book.png' style={{height:'290px', margin: 'auto', marginBottom:-20}} />
      </Box>
      <CardContent sx={{pt:0}}>
        <Stack direction='row'>
          <Button 
            variant='contained' 
            endIcon={<Iconify icon={'solar:book-2-bold-duotone'}/> }
            onClick={handleOpenFile}
          >
            Open
          </Button>
        </Stack>
      </CardContent>

    </Card>

    <PreviewFileModal open={open} modalClose={handleCloseFile} file={file} />

    </>
  );
}
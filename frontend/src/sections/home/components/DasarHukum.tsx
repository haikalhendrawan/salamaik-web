import {useState, useEffect} from'react';
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

  const [file, setFile] = useState<string | undefined>('https://jdih.kemenkeu.go.id/download/a321969c-4ce0-4073-81ce-df35023750b1/PER_1_PB_2023-Perubahan%20Atas%20PERDIRJEN%20No.PER-24_PB_2019%20tentang%20Pedoman%20Pembinaan%20&%20Supervisi%20Pelaksanaan%20Tugas%20KPPN.pdf'); // for preview file modal

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
            endIcon={<Iconify icon={'solar:file-bold-duotone'}/> }
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
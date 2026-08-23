/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState, useRef} from'react';
import {Stack, Button, Box, Typography, Grid, Tooltip, IconButton} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import PreviewFileModal from '../../../../components/previewFileModal';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import { useAuth } from '../../../../hooks/useAuth';
import useDictionary from '../../../../hooks/useDictionary';
//-------------------------------------------------------------
const StatsContainer = styled(Box)(({theme}) => ({
  backgroundColor:theme.palette.background.neutral,
  borderRadius:'12px',
  padding:theme.spacing(2),
  height:'100%',
  display: 'flex', 
  flexDirection:'column',
  gap:theme.spacing(2), 
  alignItems:'start', 
  justifyContent:'start', 
}));

const StyledButton = styled(Button)(({  }) => ({
  display: 'inline-flex',   
  alignItems: 'center', 
  justifyContent: 'center', 
  paddingRight: 0,
  paddingLeft: 0,
  minHeight: '30px',
  minWidth: '30px',
  borderRadius: '12px',
}));

interface DasarHukumGrid {
  changeSection: (section: number) => void
};
//------------------------------------------------------------
export default function DasarHukumGrid({changeSection}: DasarHukumGrid) {
  const theme = useTheme();

  const axiosJWT = useAxiosJWT();

  const {auth} = useAuth();

  const {peraturanRef} = useDictionary();

  const peraturan = peraturanRef?.find((peraturan) => peraturan.id === auth?.peraturan) || null;

  const numFieldValue = peraturan?.nomor || '';

  const textFieldValue = peraturan?.hal || '';

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?fileInputRef.current.click():null
  };

  const [open, setOpen] = useState<boolean>(false); // for preview file modal

  const [file, _] = useState<string | undefined>(`${import.meta.env.VITE_API_URL}/peraturan/${peraturan?.file}`);

  const {openSnackbar} = useSnackbar();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if(!e.target.files){return}

    const selectedFile = e.target.files[0];

    try{
      const formData = new FormData();
      formData.append("filename", `peraturan${peraturan?.id}`);
      formData.append("peraturan", selectedFile);
      await axiosJWT.post(`/editFilePeraturan`, formData, {
        headers:{"Content-Type": "multipart/form-data"}
      });
      // getData();
    }catch(err: any){
      openSnackbar("fail to update file peraturan", "error");
    }
  };

  return(
    <div>
      <Grid container spacing={2} direction='row' alignItems='start' justifyContent='center' sx={{height:'40%', p:3, pb:0}}>
        <Grid item xs={6} sm={4} md={4}>
          <Typography variant='h6'>Dasar Hukum</Typography>
          <Typography variant='body3'>Referensi dasar hukum pembinaan</Typography>
        </Grid>
        <Grid item xs={6} sm={8} md={8} >
          <StatsContainer>
            <Grid container>
              <Grid item md={6}>
                <Typography variant='body2'>Nomor Peraturan</Typography>
              </Grid>
              <Grid item md={6}>
               <Typography 
                  variant='body3' 
                >
                  {numFieldValue}
                </Typography>

              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={6}>
                <Typography variant='body2'>Nama Peraturan</Typography>
              </Grid>
              <Grid item md={6}>
                <Typography 
                  variant='body3'
                >
                  {textFieldValue}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={6}>
                <Typography variant='body2'>File</Typography>
              </Grid>
              <Grid item md={6}>
                <Stack direction='row' spacing={1}>
                  <Tooltip title='view'>
                    <span>
                      <StyledButton 
                        aria-label="approve" 
                        variant='contained' 
                        size='small' 
                        color='primary'
                        onClick={() => setOpen(true)}
                      >
                        <Iconify icon="solar:eye-bold-duotone"/>
                      </StyledButton>
                    </span>
                  </Tooltip>
                  <Tooltip title='upload file'>
                    <span>
                      <IconButton
                        aria-label="edit" 
                        size='small' 
                        sx={{color:theme.palette.text.primary}} 
                        onClick={handleClick}
                      >
                        <Iconify icon="solar:cloud-upload-bold"/>
                      </IconButton>
                    </span>
                  </Tooltip>
                  <input accept="application/pdf" type='file' style={{display:'none'}} ref={fileInputRef} tabIndex={-1} onChange={handleFileChange}/>
                </Stack>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={6}>
                <Typography variant='body2'>Peraturan</Typography>
              </Grid>
              <Grid item md={6}>
                <Button 
                  variant="contained" 
                  size="small" 
                  endIcon={<Iconify icon="solar:round-alt-arrow-right-bold" />}
                  onClick={() => changeSection(7)}
                  >
                  Edit
                </Button>
              </Grid>
            </Grid>
          </StatsContainer>
        </Grid>
      </Grid>

      <PreviewFileModal open={open} modalClose={() => setOpen(false)} file={file}/>
    </div>
  )
}
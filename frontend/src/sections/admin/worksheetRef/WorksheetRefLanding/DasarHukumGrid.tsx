/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState, useRef} from'react';
import {Stack, Button, Box, Typography, Grid, FormControl, Tooltip, IconButton} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
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
//------------------------------------------------------------
export default function DasarHukumGrid() {
  const theme = useTheme();

  const [numFieldOpen, setNumFieldOpen] = useState<boolean>(false);

  const [numFieldValue, setNumFieldValue] = useState<string>('PER-1/PB/2023');

  const handleNumFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.value.length>0?setNumFieldValue(e.target.value):null
  };

  const [textFieldOpen, setTextFieldOpen] = useState<boolean>(false);

  const [textFieldValue, setTextFieldValue] = useState<string>(`Perubahan Atas Peraturan Direktur Jenderal Perbendaharaan Nomor PER-24/PB/2019 Tentang Pedoman Pembinaan dan Supervisi Tugas Kantor Pelayanan Perbendaharaan Negara`);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.value.length>0?setTextFieldValue(e.target.value):null
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?fileInputRef.current.click():null
  };

  return(
    <div>
      <Grid container spacing={2} direction='row' alignItems='start' justifyContent='center' sx={{height:'40%', p:3, pb:0}}>
        <Grid item xs={6} sm={4} md={4}>
          <Typography variant='h6'>Dasar Hukum</Typography>
          <Typography variant='body3'>Referensi dasar hukum pembinaan</Typography>
        </Grid>
        <Grid item xs={6} sm={8} md={8} >
          <StatsContainer onClick={() => {setNumFieldOpen(false); setTextFieldOpen(false)}}>
            <Grid container>
              <Grid item md={6}>
                <Typography variant='body2'>Nomor Peraturan</Typography>
              </Grid>
              <Grid item md={6}>
                {numFieldOpen 
                ?(<FormControl onClick={(e) => e.stopPropagation()}>
                    <StyledTextField 
                      name="nomor-hukum" 
                      label="Nomor" 
                      value={numFieldValue} 
                      onBlur={() => setNumFieldOpen(false)}
                      onChange={handleNumFieldChange}
                    />
                  </FormControl>
                  )
                :(<Typography 
                    variant='body3' 
                    onClick={(e) => {
                      e.stopPropagation();
                      setNumFieldOpen(true)
                    }}
                    sx={{cursor:'pointer'}}
                  >
                    {numFieldValue}
                  </Typography>
                  )
                }
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={6}>
                <Typography variant='body2'>Nama Peraturan</Typography>
              </Grid>
              <Grid item md={6}>
              {textFieldOpen 
                ?(<FormControl onClick={(e) => e.stopPropagation()}>
                    <StyledTextField
                      multiline
                      maxRows={8}
                      name="dasar-hukum" 
                      label="Nama" 
                      value={textFieldValue}
                      onBlur={() => setTextFieldOpen(false)}
                      onChange={handleTextFieldChange}
                    />
                  </FormControl>
                  )
                :(<Typography 
                    variant='body3'
                    onClick={(e) => {
                      e.stopPropagation();
                      setTextFieldOpen(true)
                    }}
                    sx={{cursor:'pointer'}}
                    >
                    {textFieldValue}
                  </Typography>
                  )
                }
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
                      >
                        <Iconify icon="solar:eye-bold-duotone"/>
                      </StyledButton>
                    </span>
                  </Tooltip>
                  <Tooltip title='upload file'>
                    <span>
                      <IconButton
                        disabled 
                        aria-label="edit" 
                        size='small' 
                        sx={{color:theme.palette.text.primary}} 
                        onClick={handleClick}
                      >
                        <Iconify icon="solar:cloud-upload-bold"/>
                      </IconButton>
                    </span>
                  </Tooltip>
                  <input accept="application/pdf" type='file' style={{display:'none'}} ref={fileInputRef} tabIndex={-1} />
                </Stack>
              </Grid>
            </Grid>
          </StatsContainer>
        </Grid>
      </Grid>
    </div>
  )
}
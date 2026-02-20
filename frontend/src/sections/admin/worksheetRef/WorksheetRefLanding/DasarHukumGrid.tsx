/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState, useRef, useEffect} from'react';
import {Stack, Button, Box, Typography, Grid, FormControl, Tooltip, IconButton} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import PreviewFileModal from '../../../../components/previewFileModal';
import useSnackbar from '../../../../hooks/display/useSnackbar';
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

  const axiosJWT = useAxiosJWT();

  const [numFieldOpen, setNumFieldOpen] = useState<boolean>(false);

  const [numFieldValue, setNumFieldValue] = useState<string>('');

  const handleNumFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.value.length>0?setNumFieldValue(e.target.value):null
  };

  const [textFieldOpen, setTextFieldOpen] = useState<boolean>(false);

  const [textFieldValue, setTextFieldValue] = useState<string>(``);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.value.length>0?setTextFieldValue(e.target.value):null
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?fileInputRef.current.click():null
  };

  const [open, setOpen] = useState<boolean>(false); // for preview file modal

  const [file, _] = useState<string | undefined>(`${import.meta.env.VITE_API_URL}/peraturan/dasar_pembinaan.pdf`);

  const {openSnackbar} = useSnackbar();

  const getData = async () => {
    try {
      const response = await axiosJWT.get("/getMiscByType/0");
      const data = response.data.rows;
      if(data.length>0){
        setTextFieldValue(data[0].detail_1);
        setNumFieldValue(data[0].value);
      }
    } catch (err) {
      openSnackbar("Fail to get referensi peraturan", "error");
    }
  };

  const handleEditRefPeraturan = async () => {
    try {
      await axiosJWT.post("/editMiscByid", {id:1, value:numFieldValue, detail1:textFieldValue});
      getData();
    } catch (err) {
      openSnackbar("Fail to edit referensi peraturan", "error");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if(!e.target.files){return}

    const selectedFile = e.target.files[0];

    try{
      const formData = new FormData();
      formData.append("peraturan", selectedFile);
      await axiosJWT.post(`/editPeraturan`, formData, {
        headers:{"Content-Type": "multipart/form-data"}
      });
      getData();
    }catch(err: any){
      openSnackbar("Handle to update file peraturan", "error");
    }
  };

  useEffect(() => {
    getData();
  }, []);

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
                      onBlur={() => {
                        setNumFieldOpen(false);
                        handleEditRefPeraturan();
                      }}
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
                      onBlur={() => {
                        setTextFieldOpen(false);
                        handleEditRefPeraturan();
                      }}
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
          </StatsContainer>
        </Grid>
      </Grid>

      <PreviewFileModal open={open} modalClose={() => setOpen(false)} file={file}/>
    </div>
  )
}
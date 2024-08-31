import {useState, useEffect} from'react';
import {Container, Stack, Typography, Button, Card, Box, Grid, IconButton} from '@mui/material';
import {styled, useTheme} from '@mui/material/styles';
import useAxiosJWT from '../../hooks/useAxiosJWT';
import Iconify from '../../components/iconify';
import useSnackbar from '../../hooks/display/useSnackbar';
// ----------------------------------------------------------------------
export interface MiscType{
  id: number;
  misc_id:number;
  value:string;
  detail_1:string | null;
  detail_2:string | null;
  detail_3:string | null;
}

const PictureBox = styled(Box)(({ theme }) => ({
  overflow:'hidden', 
  paddingLeft: theme.spacing(2),
  paddingTop: theme.spacing(3), 
  paddingRight: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  display:'flex', 
  height:'100%', 
  width:'100%', 
  background:'cover', 
  alignContent: 'center', 
  alignItems: 'center',
  position:'relative',
}));

const StyledIconButton = styled(IconButton, {
  shouldForwardProp: () => true
})<{component?: string;}>(({}) => ({
  width:'30%', 
  height:'40%', 
  mx:'auto',
  cursor: 'pointer', 
  p:0, 
  backgroundSize: 'cover', 
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
// ----------------------------------------------------------------------
export default function GalleryInterfacePage() {
  const axiosJWT = useAxiosJWT();

  const [gallery, setGallery] = useState<MiscType[] | null>(null);

  const theme = useTheme();

  const {openSnackbar} = useSnackbar();

  const getGallery = async () => {
    try{
      const miscTypeGallery = 3;
      const response = await axiosJWT.get(`/getMiscByType/${miscTypeGallery}`);
      setGallery(response.data.rows);
    }catch(err: any){
      openSnackbar(err?.response?.data?.message, 'error');
    }
  };

  const handleChangeFile = async(e: React.ChangeEvent<HTMLInputElement>) =>{
    e.preventDefault();
    if(!e.target.files){return}

    const selectedFile = e.target.files[0];

    try{
      const formData = new FormData();
      formData.append("miscId", '3');
      formData.append("value", selectedFile.name);
      formData.append("detail1", '');
      formData.append("detail2", '');
      formData.append("detail3", '');
      formData.append("gallery", selectedFile);
      console.log(formData);
      await axiosJWT.post(`/addGallery`, formData, {
        headers:{"Content-Type": "multipart/form-data"}
      });
      getGallery();
    }catch(err: any){
      openSnackbar(err?.response?.data?.message, 'error');
    }
  };

  const handleDeleteGallery = async(id: number) => {
    try{
      await axiosJWT.post(`/deleteGallery/${id}`);
      getGallery();
    }catch(err: any){
      openSnackbar(err?.response?.data?.message, 'error');
    }
  }

  useEffect(() => {
    getGallery();
  }, [])

  return (
    <>
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Stack direction='row' spacing={2}>
            <Typography variant="h4" gutterBottom>
              Gallery
            </Typography>
          </Stack>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Add
          </Button>
        </Stack>

        <Card sx={{minHeight:480, display:'flex', flexDirection:'column'}}>
          <Grid container>
            {
              gallery?.map((item, index) => (
                <>
                  <Grid item xs={12} md={4} key={index+1}>
                    <PictureBox key={index}>
                      <img 
                          src={`${import.meta.env.VITE_API_URL}/image/${item.value}`} 
                          style={{ height:'300px', width: '100%', borderRadius:'12px'}} 
                          // onLoad={handleImageLoad}
                      />
                      <IconButton disableRipple color='pink' onClick={() => handleDeleteGallery(item.id)}>
                        <Iconify icon={"solar:close-circle-bold"}/>
                      </IconButton>
                    </PictureBox>
                  </Grid>
                </>
              ))
            }
            <Grid item xs={12} md={4} key={0}>
              <PictureBox key={0}>
                  <Box 
                    height={'300px'} 
                    width={'93%'} 
                    bgcolor={theme.palette.background.default} 
                    borderRadius={'12px'} 
                    alignContent={'center'} 
                    alignItems={'center'} 
                    justifyItems={'center'}
                    justifyContent={'center'}
                    display={'flex'}
                  >
                    <StyledIconButton
                      component='label' 
                    >
                      <Iconify icon={"solar:add-circle-bold"}/>
                      <VisuallyHiddenInput 
                        type='file'
                        accept='image/*' 
                        onChange={(e) => handleChangeFile(e)} 
                      />
                    </StyledIconButton>
                  </Box>
              </PictureBox>
            </Grid>
          </Grid>
        </Card>
      </Container>

 

      
    </>
  )
}

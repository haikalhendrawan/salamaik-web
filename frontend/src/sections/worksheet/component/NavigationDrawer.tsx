/**
 * Komponen utk navigasi kertas kerja
 */

import {useCallback, useState} from "react";
import {Box, Fab, Backdrop, Zoom, Tooltip, Grid, Button, Popper, Slide, Paper, ClickAwayListener, Stack, Typography} from "@mui/material";
import {useTheme, styled} from '@mui/material/styles';
import Iconify from "../../../components/iconify";
import Label from "../../../components/label/Label";
import Scrollbar from "../../../components/scrollbar";
import LinearProgressWithLabel from "../../../components/linear-progress-with-label/LinearProgressWithLabel";

// --------------------------------------------------------------------
const StyledFab = styled(Fab)(({theme}) => ({
  borderRadius:'12px 0px 0px 12px'
}));

const DrawerPaper = {
  p: 2,
  width: 360,
  height:'80vh',
  typography: 'body2',
  borderRadius: '8px',
  display:'flex',
  flexDirection:'column',
  position: 'fixed', bottom: 50, right: 0, top: 'unset', left: 'unset'
};

const DrawerButton = styled(Button)({
  position: "absolute",
  top:150,
  right: '360px',
  zIndex: 1,
  borderRadius:'12px 0px 0px 12px',
  maxWidth:'10px',
  minHeight: '34px',
  minWidth: '30px',
});

const SubkomponenDivider = styled(Paper)(({theme}) => ({
  padding: theme.spacing(1),
  paddingRight: theme.spacing(2),
  backgroundColor: theme.palette.grey[200],
  maxWidth: 'fit-content',
  color: theme.palette.primary.dark,
  borderRadius: '16px',
  fontWeight: '600',
  fontSize: '10px',
}));

const MOCK = Array(9).fill(null);


// --------------------------------------------------------------------
export default function NavigationDrawer(){
  const theme = useTheme();
  
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => { 
    setOpen(false);
  };

  return(
  <>
    <Zoom in>
      <Tooltip title="Drawer" placement="left">
        <Box
          role="presentation"
          sx={{
            position: "fixed",
            bottom: 400,
            right: 0,
            zIndex: 1,
          }}
        >
          <StyledFab
            color="primary"
            size="small"
            aria-label="Scroll back to top"
            variant="extended"
            onClick={() => setOpen(true)}
          >
            <Iconify icon="lucide:chevron-left" />
          </StyledFab>
        </Box>
      </Tooltip>
    </Zoom>


    <Backdrop
      sx={{ color: '#fff', zIndex: 9998 }}
      open={open}
    >
    <Popper 
        open={open} placement={'top-start'} transition sx={{ zIndex: 9999 }}>
				{({ TransitionProps }) => (
					<Slide{...TransitionProps} timeout={200} direction="left">
						<Paper sx={{...DrawerPaper, boxShadow: theme.customShadows.dialog}}>
              <DrawerButton 
                variant='contained' 
                size='small'
                endIcon={<Iconify icon="lucide:chevron-right" sx={{mr: 1}} />}
              />
							
                <Scrollbar  
                  sx={{
                    height: '100%',
                    width:'100%',
                    '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
                  }}
                >
                  <ClickAwayListener onClickAway={handleClose}>
                    <Box>
                      <Stack direction='column' spacing={1}>
                        <Stack direction='column'>
                          <Typography variant='body1' sx={{fontSize: 15}} fontWeight={'bold'}>{`Komponen Tata Kelola Internal`}</Typography>
                          <Typography variant='body3' sx={{fontSize: 14}}>{`6 Subkomponen`}</Typography>
                        </Stack>
                       
                        {/* <Typography variant='body2' sx={{fontSize: 12, pb:2, maxWidth: 270}}>Komponen : Pengelola Fiskal, Representasi Kemenkeu di Daerah, dan Special Mission</Typography> */}

                          <Grid container spacing={1} sx={{maxWidth: 300}}>

                            <Grid item xs={12} sx={{ml: -1, mb:1}}>
                              <SubkomponenDivider>
                                Subkomponen 1 : Likuiditas Keuangan di Daerah
                              </SubkomponenDivider>
                            </Grid>

                            {Array(2).fill(null).map((item, i) => (
                              <Grid item xs={2}>
                                <Label color="success" sx={{border:1, width: 22, cursor: 'pointer' }}>{ i + 1 }</Label>
                              </Grid>
                            ))}

                            <Grid item xs={12} sx={{ml: -1, mt:1, mb:1}}>
                              <SubkomponenDivider>
                                Subkomponen 2 : Penyaluran Belanja atas Beban APBN
                              </SubkomponenDivider>
                            </Grid>
                            {Array(12).fill(null).map((item, i) => (
                              <Grid item xs={2}>
                                <Label color="success" sx={{border:1, width: 22, cursor: 'pointer' }}>{ i + 3 }</Label>
                              </Grid>
                            ))}

                          <Grid item xs={12} sx={{ml: -1, mt:1, mb:1}}>
                            <SubkomponenDivider>
                              Subkomponen 3 : Pemantauan dan Evaluasi Kinerja Anggaran Satker dan Reviu Pelaksanaan Anggaran Satker K/L dan BLU
                            </SubkomponenDivider>
                          </Grid>
                          {Array(12).fill(null).map((item, i) => (
                            <Grid item xs={2}>
                              <Label color="success" sx={{border:1, width: 22, cursor: 'pointer' }}>{ i + 15 }</Label>
                            </Grid>
                          ))}

                          <Grid item xs={12} sx={{ml: -1, mt:1, mb:1}}>
                            <SubkomponenDivider>
                              Subkomponen 4 : Pengelolaan Rekening dan Penerimaan Negara
                            </SubkomponenDivider>
                          </Grid>
                          {Array(5).fill(null).map((item, i) => (
                            <Grid item xs={2}>
                              <Label color="success" sx={{border:1, width: 22, cursor: 'pointer' }}>{ i + 27 }</Label>
                            </Grid>
                          ))}

                          <Grid item xs={12} sx={{ml: -1, mt:1, mb:1}}>
                            <SubkomponenDivider>
                              Subkomponen 5 : Akuntabilitas Pelaporan Keuangan
                            </SubkomponenDivider>
                          </Grid>
                          {Array(3).fill(null).map((item, i) => (
                            <Grid item xs={2}>
                              <Label color="success" sx={{border:1, width: 22, cursor: 'pointer' }}>{ i + 32 }</Label>
                            </Grid>
                          ))}

                          <Grid item xs={12} sx={{ml: -1, mt:1, mb:1}}>
                            <SubkomponenDivider>
                              Subkomponen 6 : Quality Assurance Pengelolaan APBN oleh Satuan Kerja
                            </SubkomponenDivider>
                          </Grid>
                          {Array(2).fill(null).map((item, i) => (
                            <Grid item xs={2}>
                              <Label color="success" sx={{border:1, width: 22, cursor: 'pointer' }}>{ i + 35 }</Label>
                            </Grid>
                          ))}


                        </Grid>
                      </Stack>
                    </Box>
                </ClickAwayListener>
                </Scrollbar>

						</Paper>
					</Slide>
				)}
			</Popper>
    </Backdrop>
    
  </>
  )
}
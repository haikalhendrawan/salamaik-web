/**
 * Komponen utk navigasi kertas kerja
 */

import {useMemo, useState, useCallback} from "react";
import {Box, Fab, Backdrop, Zoom, Tooltip, Grid, Button, Popper, Slide, Paper, ClickAwayListener, Stack, Typography} from "@mui/material";
import {useTheme, styled} from '@mui/material/styles';
import useDictionary from "../../../hooks/useDictionary";
import { useAuth, AuthType } from "../../../hooks/useAuth";
import useWsJunction from "../useWsJunction";
import Iconify from "../../../components/iconify";
import Label from "../../../components/label/Label";
import Scrollbar from "../../../components/scrollbar";
import { WsJunctionType } from "../types";
// --------------------------------------------------------------------
const StyledFab = styled(Fab)(({}) => ({
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
  width:'100%',
  color: theme.palette.common.black,
  borderRadius: '16px',
  fontWeight: '200',
  fontSize: '10px',
  cursor: 'pointer'
}));

const StyledLabel = styled(Label)(({}) => ({
  border: `1px solid `, 
  width: 22, 
  cursor: 'pointer'
}));


// --------------------------------------------------------------------
export default function NavigationDrawer({tabValue, scrollToElement}: {tabValue: number, scrollToElement: (id: string) => void}) {
  const theme = useTheme();
  
  const [open, setOpen] = useState<boolean>(false);

  const { auth } = useAuth();

  const { komponenRef, subKomponenRef } = useDictionary();

  const { wsJunction } = useWsJunction();

  const handleClose = () => { 
    setOpen(false);
  };

  const handleScrollAndClose = (id: number, type: string) => {
    scrollToElement(type + id.toString());
    setOpen(false);
  };

  const componentTitle = useMemo(() => {
    return komponenRef?.find((item) => item?.id === tabValue)?.title || ''
  }, [tabValue]);

  const subComponentAmount = useMemo(() => {
    return subKomponenRef?.filter((item) => item?.komponen_id === tabValue)?.length || ''
  }, [tabValue]);

  const content = useCallback(() =>
    subKomponenRef?.filter(item => item?.komponen_id === tabValue)?.map((i) => (
      <>
        <Grid item xs={12} sx={{ml: -1, my: 1}} key={i.id}>
          <SubkomponenDivider onClick={() => handleScrollAndClose(i?.id, "divider")}>
            {i?.title}
          </SubkomponenDivider>
        </Grid>
       
  
        {wsJunction
          ?.filter(item => item?.komponen_id === tabValue && item?.subkomponen_id === i?.id)
          .map((item, index) => {
  
            return (
              <Grid item xs={2} onClick={() => handleScrollAndClose(item.checklist_id, "card")} key={index}>
                <StyledLabel color={getLabelColor(item, auth)}>
                  { item?.checklist_id }
                </StyledLabel>
              </Grid>
            );
          })}
      </>
    ))
  , [tabValue, wsJunction, auth]);


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
                          <Typography variant='body1' sx={{fontSize: 15}} fontWeight={'bold'}>{"Komponen " + componentTitle}</Typography>
                          <Typography variant='body3' sx={{fontSize: 14}}>{subComponentAmount + " Subkomponen"}</Typography>
                        </Stack>

                        <Grid container spacing={1} sx={{maxWidth: 300, pb: 2}}>
                          {content()}
                        </Grid>

                        <Stack direction='column' spacing={1}>
                          <Stack direction="row" spacing={4}>
                            <Stack direction='row' spacing={1}>
                              <StyledLabel color="pink" >{ }</StyledLabel>
                              <Typography variant='body2' sx={{fontSize: 10}}>: Belum diisi</Typography>
                            </Stack>
                            <Stack direction='row'  spacing={1}>
                              <StyledLabel color="warning">{ }</StyledLabel>
                              <Typography variant='body2' sx={{fontSize: 10}}>: Sudah diisi/nilai belum maksimal</Typography>
                            </Stack>
                          </Stack>
                          <Stack direction='row'  spacing={1}>
                            <StyledLabel color="success">{ }</StyledLabel>
                            <Typography variant='body2' sx={{fontSize: 10}}>: Sudah diisi/nilai maksimal</Typography>
                          </Stack>
                        </Stack>
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


// --------------------------------------------------------------------------------------------------------------------
function getLabelColor(item: WsJunctionType, auth: AuthType | null){
  const isKanwil = [3, 4, 99].includes(auth?.role || 0);
  const isExcluded = item?.excluded === 1;
  const score = isKanwil?item.kanwil_score: item.kppn_score;

  if(isExcluded){
    return "success"
  }

  if(score===null){
    return "pink"
  };

  if(score<10){
    return "warning"
  };

  return "success"
};
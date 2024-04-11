import {useState} from "react";
import {Card, Typography, Grid, Box, Tabs, Tab, CardContent, Stack, IconButton, Slide} from '@mui/material';
import {styled, useTheme} from '@mui/material/styles';
import Iconify from "../../../components/iconify";
// ----------------------------------------------
interface ScorePembinaanProps {
  header: string,
  selfScore: number,
  kanwilScore: number
};

// ----------------------------------------------

export default function ScorePembinaan({header, selfScore, kanwilScore}: ScorePembinaanProps){
  const theme = useTheme();

  const [value, setValue] = useState<number>(0);

  return(
    <Card sx={{height:'200px', borderRadius:'16px'}}>
      <CardContent sx={{height:'100%'}}>
        <Grid container sx={{height:'100%'}}>
          <Grid item xs={12} sm={6} md={6}>
            <Stack direction='column' spacing={1} sx={{height:'100%'}} justifyContent={'space-between'} >
              <Stack direction='column'>
                <Typography variant="subtitle2">{header}</Typography>

                <Slide direction="left" in={value===0}>
                  <Typography variant="body2" color={theme.palette.text.secondary} sx={{display:value===0?'block':'none'}}>Berdasarkan Self Assessment</Typography>
                </Slide>

                <Slide direction="left" in={value===1}>
                  <Typography variant="body2" color={theme.palette.text.secondary} sx={{display:value===1?'block':'none'}}> Berdasarkan penilaian Kanwil </Typography>
                </Slide>
                
              </Stack>

            </Stack>

          </Grid>
          <Grid item xs={12} sm={6} md={6} sx={{display:'flex', height:'100%', alignContent:'center', alignItems:'center', justifyContent:'center'}}>
            <Stack direction={'row'} alignItems="center"> 
              <IconButton 
                disabled={value===0?true:false} 
                sx={{height:'40px', width:'40px', color: value==1?theme.palette.text.primary:null}}
                onClick={() => setValue(0)}
              >
                <Iconify icon={'eva:arrow-ios-back-outline'}/> 
              </IconButton>
              
              <Slide direction="left" in={value===0}>
               <Typography variant="h2" sx={{display:value===0?'block':'none'}} color='primary'>{selfScore}</Typography>
              </Slide>

              <Slide direction="left" in={value===1}>
               <Typography variant="h2" sx={{display:value===1?'block':'none'}} color='primary'>{kanwilScore}</Typography>
              </Slide>
              
              <IconButton
                disabled={value===1?true:false}   
                sx={{height:'40px', width:'40px', color: value==0?theme.palette.text.primary:null }}
                onClick={() => setValue(1)}
              >
                <Iconify icon={'eva:arrow-ios-forward-outline'} />
              </IconButton>
            </Stack>

          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
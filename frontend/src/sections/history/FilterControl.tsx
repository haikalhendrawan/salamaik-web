/**
*Salamaik Client 
* © Kanwil DJPb Sumbar 2024
*/

import {Card, Typography, Grid, CardContent, Stack, FormControl} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import Iconify from '../../components/iconify/Iconify';
import { StyledSelect, StyledSelectLabel, StyledMenuItem } from '../../components/styledSelect';
import useDictionary from '../../hooks/useDictionary';
import AnimatedIcon from './AnimatedIcon';

export default function FilterControl() {
  const theme = useTheme();

  const {periodRef, kppnRef} = useDictionary();

  const GROUP = [
    'Overview',
    'Tim pembinaan kanwil',
    'PIC pembinaan KPPN',
    'Tanggal periode pembinaan',
    'Tanggal periode tindak lanjut',
  ];

  return (
    <Card>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <Stack direction='column'>
              <span style={{display: 'flex', flexDirection: 'row', gap: 4}}>
                <Typography variant="subtitle2">Scope Filter</Typography>
                <Iconify icon="solar:telescope-bold-duotone" color={theme.palette.grey[500]} />
              </span>

              <Typography variant="body2" color={theme.palette.text.secondary}>
                {"Input range data yang ingin dicari"}
              </Typography>

              <FormControl sx={{mt: 4, width: '80%'}} size="small">
                <StyledSelectLabel id="kppn-selection-label">KPPN</StyledSelectLabel>
                <StyledSelect 
                  labelId="kppn-selection-label"
                  label="KPPN" 
                  id="kppn-selection" 
                  name="kppn-selection" 
                >
                  {
                    kppnRef?.list?.filter((item) => item.id.length !==5).map((item) => (
                      <StyledMenuItem key={item.id} value={item.id}>{item.name}</StyledMenuItem>
                    ))
                  }
                </StyledSelect>
              </FormControl>
              
              <FormControl sx={{mt: 4}} size="small">
                <StyledSelectLabel id="period-selection-label">Periode</StyledSelectLabel>
                <StyledSelect 
                  labelId="period-selection-label"
                  label="Periode" 
                  id="period-selection" 
                  name="period-selection" 
                >
                  {
                    periodRef?.list?.map((item) => (
                      <StyledMenuItem key={item.id} value={item.id}>{item.name}</StyledMenuItem>
                    ))
                  }
                </StyledSelect>
              </FormControl>

              <FormControl sx={{mt: 4}} size="small">
                <StyledSelectLabel id="group-selection-label">Group</StyledSelectLabel>
                <StyledSelect 
                  labelId="group-selection-label"
                  label="group" 
                  id="group-selection" 
                  name="group-selection" 
                >
                  {
                     GROUP.map((item, index) => (
                      <StyledMenuItem key={index} value={index}>{item}</StyledMenuItem>
                    ))
                  }
                </StyledSelect>
              </FormControl>

              <AnimatedIcon />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

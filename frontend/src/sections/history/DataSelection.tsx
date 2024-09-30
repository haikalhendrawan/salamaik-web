/**
*Salamaik Client 
* © Kanwil DJPb Sumbar 2024
*/

import {Card, Typography, Grid, FormControl, CardContent, Stack} from '@mui/material';
import {useTheme} from '@mui/material/styles'
import { StyledSelect, StyledSelectLabel, StyledMenuItem } from '../../components/styledSelect';
import Iconify from '../../components/iconify/Iconify';

export default function DataSelection() {
  const theme = useTheme();

  return (
    <Card>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <Stack direction='column'>
              <span style={{display: 'flex', flexDirection: 'row', gap: 4}}>
                <Typography variant="subtitle2">Kategori Data</Typography>
                <Iconify icon="solar:signpost-2-bold-duotone" color={theme.palette.grey[500]} />
              </span>

              <Typography variant="body2" color={theme.palette.text.secondary}>
                {"Silahkan pilih jenis data yang akan dicari"}
              </Typography>
              <FormControl sx={{mt: 4}} size="small">
                <StyledSelectLabel id="data-selection-label">Data</StyledSelectLabel>
                <StyledSelect 
                  labelId="data-selection-label"
                  label="Data" 
                  id="data-selection" 
                  name="data-selection" 
                >
                  <StyledMenuItem value="0">1. Detil Pembinaan</StyledMenuItem>
                  <StyledMenuItem value="1">1. Jumlah Permasalahan</StyledMenuItem>
                  <StyledMenuItem value="2">2. Jumlah Permasalahan Per Komponen</StyledMenuItem>
                  <StyledMenuItem value="3">3. Jumlah Permasalahan Per Subkomponen</StyledMenuItem>
                  <StyledMenuItem value="4">4. Detail Permasalahan </StyledMenuItem>
                  <StyledMenuItem value="5">5. Detail Rekomendasi</StyledMenuItem>
                </StyledSelect>
              </FormControl>
              
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

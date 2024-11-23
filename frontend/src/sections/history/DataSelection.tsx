/**
*Salamaik Client 
* © Kanwil DJPb Sumbar 2024
*/

import {Card, Typography, Grid, FormControl, CardContent, Stack, SelectChangeEvent} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import { StyledSelect, StyledSelectLabel, StyledMenuItem } from '../../components/styledSelect';
import Iconify from '../../components/iconify/Iconify';

interface DataSelectionProps {
  selectedData: number;
  handleChange: (event: SelectChangeEvent<unknown>, type: string) => void;
}

export default function DataSelection({selectedData, handleChange}: DataSelectionProps) {
  const theme = useTheme();

  const isNoData = selectedData === 0;

  return (
    <Card>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <Stack direction='column'>
              <span style={{display: 'flex', flexDirection: 'row', gap: 4}}>
                <Typography variant="subtitle2">Data</Typography>
                <Iconify icon="solar:signpost-2-bold-duotone" color={theme.palette.grey[500]} />
              </span>

              <Typography variant="body2" color={theme.palette.text.secondary}>
                {"Data apa yang anda cari?"}
              </Typography>
              <FormControl sx={{mt: 4}} size="small" error={isNoData}>
                <StyledSelectLabel id="data-selection-label">Data</StyledSelectLabel>
                <StyledSelect 
                  labelId="data-selection-label"
                  label="Data" 
                  id="data-selection" 
                  name="data-selection"
                  value={selectedData}
                  defaultValue={"0"}
                  onChange={(e) => handleChange(e, 'data')}
                >
                  <StyledMenuItem value="0" key={0}>-None-</StyledMenuItem>
                  <StyledMenuItem value="1" key={1}>1. Permasalahan</StyledMenuItem>
                  <StyledMenuItem value="2" key={2}>2. Checklist Kertas Kerja</StyledMenuItem>
                  <StyledMenuItem value="3" key={3}>3. Informasi Pembinaan</StyledMenuItem>
                </StyledSelect>
              </FormControl>
              
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

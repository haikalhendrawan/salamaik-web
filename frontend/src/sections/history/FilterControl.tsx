/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

 import {Card, Typography, Grid, CardContent, Stack, Slide} from '@mui/material';
 import {useTheme} from '@mui/material/styles';

export default function FilterControl() {
  const theme = useTheme();

  return (
    <Card>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <Stack direction='column'>
              <Typography variant="subtitle2">Filter Control</Typography>

              <Slide direction="left" in>
                <Typography variant="body2" color={theme.palette.text.secondary}>
                  {"Detil pencarian data, updating data by define berdasarkan kolom yang tersedia"}
                </Typography>
              </Slide>
              
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

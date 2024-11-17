import {Card, Typography, Grid, FormControl, CardContent, Stack} from '@mui/material';
import {useTheme} from '@mui/material/styles';

export default function Findings() {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            Findings
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

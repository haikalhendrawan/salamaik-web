import {Card, CardContent, Grid, Stack, Typography, Avatar, List, ListItemText} from '@mui/material';
import useDictionary from '../../../hooks/useDictionary';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
import {useTheme} from '@mui/material/styles';

interface InfoProps{
  selectedUnit: string;
  selectedPeriod: number;
  selectedData: number;
}

export default function Info({selectedUnit, selectedPeriod, selectedData}:InfoProps) {
  const theme = useTheme();
  
  const {komponenRef, periodRef, kppnRef, subKomponenRef} = useDictionary();

  const unitString = kppnRef?.list.filter((item) => item.id === selectedUnit)?.[0]?.alias || '';

  const periodString = periodRef?.list.filter((item) => item.id === selectedPeriod)?.[0]?.name || '';

  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={12}>
              <Stack direction={'row'} justifyContent={'center'} textAlign={'center'} marginBottom={6}>
                <Stack>
                  <Typography variant='h6'>{`Informasi Pembinaan`} </Typography>
                  <Typography variant='body3'>{`${unitString}, Periode ${periodString}`} </Typography>
                </Stack>
              </Stack>
              <Stack direction={'row'} gap={2} marginBottom={4}>
                <div>
                  <Iconify icon="solar:calendar-bold-duotone" color={theme.palette.grey[500]}/>
                </div>
                <div>
                  <Typography fontWeight={600} variant="body2">{`Periode Pembinaan :`}</Typography>
                  <Label color='success'>12/03/2023</Label>
                  <Typography variant='body3'>{`-`} </Typography>
                  <Label color='error'>01/05/2024</Label>
                </div>
              </Stack>
              <Stack direction={'row'} gap={2} marginBottom={4}>
                <div>
                  <Iconify icon="solar:rocket-bold-duotone" color={theme.palette.grey[500]} />
                </div>
                <div>
                  <Typography fontWeight={600} variant="body2">{`Periode Tindak Lanjut :`}</Typography>
                  <Label color='success'>12/03/2023</Label>
                  <Typography variant='body3'>{`-`} </Typography>
                  <Label color='error'>01/05/2024</Label>
                </div>
              </Stack>
              <Stack direction={'row'} gap={2} marginBottom={4}>
                <div>
                  <Iconify icon="solar:rocket-bold-duotone" color={theme.palette.grey[500]} />
                </div>
                <div>
                  <Typography fontWeight={600} variant="body2">{`User Kanwil :`}</Typography>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap:'1rem'}}>
                    {
                      new Array(10).fill(10).map((item, index) => (
                        <>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Avatar alt={"0"} src={`${import.meta.env.VITE_API_URL}/avatar/199904082021011001?${new Date().getTime()}`} sx={{ width: 24, height: 24 }}/>
                            <List disablePadding dense>
                              <ListItemText>
                                <Typography variant="body2" noWrap>{"Aqima Hesnatita"}</Typography>
                              </ListItemText>
                            </List>
                          </Stack>
                        </>
                      ))
                    }
                  </div>
                </div>
              </Stack>
              <Stack direction={'row'} gap={2} marginBottom={4}>
                <div>
                  <Iconify icon="solar:rocket-bold-duotone" color={theme.palette.grey[500]} />
                </div>
                <div>
                  <Typography fontWeight={600} variant="body2">{`User KPPN :`}</Typography>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap:'1rem'}}>
                    {
                      new Array(10).fill(10).map((item, index) => (
                        <>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Avatar alt={"0"} src={`${import.meta.env.VITE_API_URL}/avatar/199904082021011001?${new Date().getTime()}`} sx={{ width: 24, height: 24 }}/>
                            <List disablePadding dense>
                              <ListItemText>
                                <Typography variant="body2" noWrap>{"Aqima Hesnatita"}</Typography>
                              </ListItemText>
                            </List>
                          </Stack>
                        </>
                      ))
                    }
                  </div>
                </div>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

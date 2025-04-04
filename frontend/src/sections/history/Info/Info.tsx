import {Card, CardContent, Grid, Stack, Typography} from '@mui/material';
import useDictionary from '../../../hooks/useDictionary';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
import {useTheme} from '@mui/material/styles';
import UserItem from './components/UserItem';
import useAxiosJWT from '../../../hooks/useAxiosJWT';
import { useEffect, useState } from 'react';
import useSnackbar from '../../../hooks/display/useSnackbar';

interface InfoProps{
  selectedUnit: string;
  selectedPeriod: number;
  selectedData: number;
};

interface SimpleUser{
  name: string;
  kppn: string;
  nip: string;
  picture: string;
};

interface InfoData{
  score: number | null;
  findings: number | null;
  isFinal: boolean;
  openPeriod: string | null;
  closePeriod: string | null;
  openFollowUp: string | null;
  closeFollowUp: string | null;
  users: SimpleUser[] | null;
};

export default function Info({selectedUnit, selectedPeriod}:InfoProps) {
  const theme = useTheme();

  const axiosJWT = useAxiosJWT();

  const [info, setInfo] = useState<InfoData | null>(null);

  const {openSnackbar} = useSnackbar();
  
  const { periodRef, kppnRef} = useDictionary();

  const unitString = kppnRef?.list.filter((item) => item.id === selectedUnit)?.[0]?.alias || '';

  const periodString = periodRef?.list.filter((item) => item.id === selectedPeriod)?.[0]?.name || '';

  const getData = async() => {
    try{
      const response = await axiosJWT.get(`/info/getByKPPN/${selectedUnit}/${selectedPeriod}`);
      setInfo(response.data);
    }catch(err: any){
      setInfo(null);
      openSnackbar(err?.response?.data?.message, "error");
    }
  }

  useEffect(() => {
    getData();
  }, [selectedUnit, selectedPeriod]);

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
                  <Iconify icon="solar:sledgehammer-bold-duotone" color={theme.palette.grey[500]}/>
                </div>
                <div>
                  <Typography fontWeight={600} variant="body2">{`Nilai Kinerja KPPN :`}</Typography>
                  <Typography variant='body3'>{info?.score?.toFixed(2) || '-'} </Typography>
                </div>
              </Stack>
              <Stack direction={'row'} gap={2} marginBottom={4}>
                <div>
                  <Iconify icon="solar:document-add-bold-duotone" color={theme.palette.grey[500]}/>
                </div>
                <div>
                  <Typography fontWeight={600} variant="body2">{`Permasalahan :`}</Typography>
                  <Typography variant='body3'>
                    {`${info?.findings || '-'} ${(info?.isFinal? "(Final)" : "(Non Final)")}`}
                  </Typography>
                </div>
              </Stack>
              <Stack direction={'row'} gap={2} marginBottom={4}>
                <div>
                  <Iconify icon="solar:calendar-bold-duotone" color={theme.palette.grey[500]}/>
                </div>
                <div>
                  <Typography fontWeight={600} variant="body2">{`Periode Pembinaan :`}</Typography>
                  <Label color='success'>{new Date(info?.openPeriod || '').toLocaleDateString('id-ID')}</Label>
                  <Typography variant='body3'>{`-`} </Typography>
                  <Label color='error'>{new Date(info?.closePeriod || '').toLocaleDateString('id-ID')}</Label>
                </div>
              </Stack>
              <Stack direction={'row'} gap={2} marginBottom={4}>
                <div>
                  <Iconify icon="solar:rocket-bold-duotone" color={theme.palette.grey[500]} />
                </div>
                <div>
                  <Typography fontWeight={600} variant="body2">{`Periode Tindak Lanjut :`}</Typography>
                  <Label color='success'>{new Date(info?.openFollowUp || '').toLocaleDateString('id-ID')}</Label>
                  <Typography variant='body3'>{`-`} </Typography>
                  <Label color='error'>{new Date(info?.closeFollowUp || '').toLocaleDateString('id-ID')}</Label>
                </div>
              </Stack>
              <Stack direction={'row'} gap={2} marginBottom={4}>
                <div>
                  <Iconify icon="solar:city-bold-duotone" color={theme.palette.grey[500]} />
                </div>
                <div>
                  <Typography fontWeight={600} variant="body2">{`User Kanwil :`}</Typography>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap:'1rem'}}>
                    {
                      info?.users?.filter((item) => item.kppn.length === 5).map((item, index) => (
                        <>
                          <UserItem name={item.name} nip={item.nip} key={index} avatar={item.picture}/>
                        </>
                      ))
                    }
                  </div>
                </div>
              </Stack>
              <Stack direction={'row'} gap={2} marginBottom={4}>
                <div>
                  <Iconify icon="solar:garage-bold-duotone" color={theme.palette.grey[500]} />
                </div>
                <div>
                  <Typography fontWeight={600} variant="body2">{`User KPPN :`}</Typography>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap:'1rem'}}>
                    {
                      info?.users?.filter((item) => item.kppn.length !== 5).map((item, index) => (
                        <>
                          <UserItem name={item.name} nip={item.nip} key={index} avatar={item.picture}/>
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

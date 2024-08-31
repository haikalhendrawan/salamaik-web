import {useMemo} from 'react';
import {Stack,Typography} from '@mui/material';
import { useLocation } from 'react-router-dom';
import useDictionary from '../../../hooks/useDictionary';
import {useAuth} from '../../../hooks/useAuth';

export default function MatrixDetailHeader() {
  const {auth} = useAuth();

  const params = new URLSearchParams(useLocation().search);
  
  const id= params.get('id') || "";

  const {kppnRef, periodRef} = useDictionary();

  const kppnName = useMemo(() => {
    return kppnRef?.list.filter((item) => item.id === id)[0]?.alias || '';
  }, [kppnRef]);

  const periodName = useMemo(() => {
    const semester = periodRef?.list.filter((item) => item.id === auth?.period)[0]?.semester ;
    const tahun = periodRef?.list.filter((item) => item.id === auth?.period)[0]?.tahun ;

    return 'Semester ' + semester + ' Tahun ' + tahun;
  }, [periodRef]);


 return (
    <>
      <Stack direction='column' marginBottom={2} sx={{mb: 5}}>
        <Typography variant='h6' textAlign={'center'}>Matriks Hasil Supervisi Pada {kppnName} </Typography>
        <Typography variant='h6' textAlign={'center'}>Kanwil Direktorat Jenderal Perbendaharaan Provinsi Sumatera Barat</Typography>
        <Typography variant='h6' textAlign={'center'}>Periode {periodName}</Typography>
      </Stack>
    </>
 )
}

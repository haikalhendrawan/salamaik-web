/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { useState, useEffect } from 'react';
import { Button} from '@mui/material';
import Iconify from '../../../../components/iconify/Iconify';
import FollowUpTable from './FollowUpTable';
import { FindingsResponseType } from '../../../followUp/types';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';

// ---------------------------------------------------


interface FindingsDetailProps{
  hideDetail: () => void,
  kppnId: string,
  periodId: number
}

export default function FindingsDetail({hideDetail, periodId, kppnId}: FindingsDetailProps) {

  const [findings, setFindings] = useState<FindingsResponseType[] | []>([]);

  const axiosJWT = useAxiosJWT();

  const getFindings = async() => {
    try{
      if(!kppnId){
        return null
      };

      const response = await axiosJWT.get(`/getFindingsByWorksheetId/${kppnId}/${periodId}`);
      setFindings(response.data.rows);
    }catch(err: any){
      // setIsLoading(false);
      setFindings([]);
      if(err.response){
        // openSnackbar(err.response.data.message, "error");
      }else{
        // openSnackbar('network error', "error");
      }
    }finally{
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    getFindings();
  }, [kppnId, periodId]);

  return (
    <>  
        <Button onClick={hideDetail} startIcon={<Iconify icon="eva:arrow-ios-back-fill" />} variant='contained' color='white' sx={{mb: 2}}>Back</Button>
        <FollowUpTable findings={findings} kppnId={kppnId}/>
    </>

  )
}

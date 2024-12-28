/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { useState, useEffect } from 'react';
import {Stack, Typography, Table, Card, CardHeader, TableSortLabel,
        TableHead, Grow, TableBody, TableRow, TableCell, Button} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Label from '../../../../components/label';
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
      console.log(response.data.rows);

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
        <Button onClick={hideDetail}>Back</Button>
        <FollowUpTable findings={findings} kppnId={kppnId}/>
    </>

  )
}

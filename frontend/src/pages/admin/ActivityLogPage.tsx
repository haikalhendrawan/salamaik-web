/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState, useEffect} from'react';
import {Container, Stack, Typography} from '@mui/material';
import axiosJWT from '../../config/axios';
import useSnackbar from '../../hooks/display/useSnackbar';
import useLoading from '../../hooks/display/useLoading';
import ActivityLogTable from '../../sections/admin/activityLogInterface/ActivityLogTable';
//------------------------------------------------------------------------
export interface ActivityLogType{
  id: number,
  activity_id: number, 
  user_id: string, 
  timestamp: string | Date,
  activity_name: string,
  cluster: number,
  description: string,
  user_name: string
}

//------------------------------------------------------------------------
export default function ActivityLogPage() {
  const [activity, setactivity] = useState<ActivityLogType[] | []>([]);

  const { openSnackbar } = useSnackbar();

  const {setIsLoading} = useLoading();

  const getactivity= async()=>{
    try{
      setIsLoading(true);
      const response = await axiosJWT.get(`/getAllActivityWithLimit`); 
      setactivity(response.data.rows);
      console.log(response.data.rows);
    }catch(err){
      openSnackbar("Failed to fetch activity", "error");
      setIsLoading(false);
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getactivity(); 
  }, []);

  return (
    <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Stack direction='row' spacing={2}>
            <Typography variant="h4" gutterBottom>
              Activity Log
            </Typography>
          </Stack>
        </Stack>

        <ActivityLogTable activity={activity}/>
      </Container>

  )
}

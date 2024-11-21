import {useState} from 'react';
import {Card, Typography, Grid, FormControl, CardContent, Stack} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import AmountBarChart from './components/AmountBarChart';
import useDictionary from '../../../hooks/useDictionary';
import { useEffect } from 'react';
import useAxiosJWT from '../../../hooks/useAxiosJWT';
// -----------------------------------------------------------------------
interface FindingsWithChecklist{
  id: number,
  ws_junction_id: number,
  worksheet_id: string,
  checklist_id: number,
  matrix_id: number, 
  kppn_reponse: string,
  kanwil_response: string,
  score_before: number,
  score_after: number,
  last_update: string,
  status: number,
  updated_by: string,
  title: string | null, 
  komponen_id: number,
  subkomponen_id: number,
  komponen_title: string,
  subkomponen_title: string,
  period: number
}

interface FindingsProps{
  selectedUnit: string,
  selectedPeriod: number,
  selectedData: number
}
// -----------------------------------------------------------------------

export default function Findings({selectedUnit, selectedPeriod, selectedData}:FindingsProps) {
  const {komponenRef, periodRef} = useDictionary();

  const axiosJWT = useAxiosJWT();

  const komponenRefStringArray = komponenRef?.map((item) => item.alias) || [];

  const [findingsData, setFindingsData] = useState<FindingsWithChecklist[]>([]);

  const periodList =  periodRef?.list.filter((item) => item.id === selectedPeriod)|| [];

  const getFindings = async() => {
    try{
      // setIsLoading(true);
      const response3 = await axiosJWT.get('/getAllFindingsWithChecklistDetail');
      setFindingsData(response3.data.rows);
      // setIsLoading(false);
    }catch(err:any){
      // setIsLoading(false);
      // openSnackbar(err.response.data.message, 'error');
    }finally{
      // setIsLoading(false);
    }
  };

  const last2PeriodFindings = periodList?.map((item) => {
    const findingsPerKomponen = komponenRef?.map((k) => {
      return findingsData?.filter((f) => (f.komponen_id === k.id) && (f.period === item.id))?.length || 0;
    });

    return {
      name: item.name || "",
      type: 'bar',
      fill: 'gradient',
      data: findingsPerKomponen || []
    }
  }) || [];

  
  useEffect(() => {
    getFindings();
  }, []);

  return (
    <Card>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            Findings
            <AmountBarChart
              title= "Permasalahan Per Komponen"
              subheader = {periodRef?.list?.filter((item) => item.id === selectedPeriod)?.[0]?.name || 'Semester -'}
              chartLabels={komponenRefStringArray}
              chartData= {last2PeriodFindings}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

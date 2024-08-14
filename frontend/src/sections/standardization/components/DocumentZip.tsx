import {useEffect, useState} from "react";
import {Card, Grid, CardHeader,  Button, Box, FormControl, MenuItem} from '@mui/material';
import styled from '@mui/material/styles/styled';
import Iconify from "../../../components/iconify/Iconify";
import useStandardization from "../useStandardization";
import useDictionary from "../../../hooks/useDictionary";
import useAxiosJWT from "../../../hooks/useAxiosJWT";
import { StyledSelect} from "../../../components/styledSelect";
import useSnackbar from "../../../hooks/display/useSnackbar";
import { useAuth } from "../../../hooks/useAuth";
// ----------------------------------------------
interface DocumentShortProps {
  header: string,
  subheader: string,
  image: string,
  tabValue?: string
};
const StyledFormControl = styled(FormControl)(({}) => ({
  width: '70%',
  height: '25%'
}));

const StyledMenuItem = styled(MenuItem)(({}) => ({
  fontSize: 12,
}));

const semester1Int = [1, 2, 3, 4, 5, 6];
const semester2Int = [7, 8, 9, 10, 11, 12];

const semester1Object = [{month: 'Januari', value: 1}, {month: 'Februari', value: 2}, {month: 'Maret', value: 3}, {month: 'April', value: 4}, {month: 'Mei', value: 5}, {month: 'Juni', value: 6}];
const semester2Object = [{month: 'Juli', value: 7}, {month: 'Agustus', value: 8}, {month: 'September', value: 9}, {month: 'Oktober', value: 10}, {month: 'November', value: 11}, {month: 'Desember', value: 12}];
// ----------------------------------------------

export default function DocumentZip({header, subheader, image, tabValue }:DocumentShortProps){
  const [loading, setLoading] = useState<boolean>(false);
  
  const {standardization} = useStandardization();

  const {auth} = useAuth();

  const {periodRef, kppnRef} = useDictionary();

  const axiosJWT = useAxiosJWT();

  const {openSnackbar} = useSnackbar();

  useEffect(() => {
    async function refresh(){
      setLoading(true);
      setTimeout(() => setLoading(false), 1000); 
    }

    refresh()
  },[tabValue]);

  const handleDownloadFile = async () => {
    try {
      const kppnId = tabValue;
      const month = selectedMonth;
      const monthName = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const monthString = monthName[Number(month)-1];
      const kppnString = kppnRef?.list?.filter((item) => item.id === kppnId)[0]?.alias || '';
      const year = periodRef?.list?.filter((item) => item.id === auth?.period)[0]?.tahun || 0;
      const response = await axiosJWT.post('/getStdFilePerMonthKPPN', {
        kppnId,
        month
      }, {
        responseType: 'blob'
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${kppnString}-${monthString}-${year}.zip`); 
      document.body.appendChild(link);
      link.click();
  
      window.URL.revokeObjectURL(url);
  
    } catch (err: any) {
      openSnackbar(err.message, 'error');
    }
  };

  const isEven = periodRef?.list?.filter((item) => item.id === auth?.period)[0]?.even_period === 1 ? true : false;

  const currentMonth = new Date().getMonth()+1;

  const selectedSemester = isEven ? semester2Object : semester1Object;

  const selectedSemesterInt = isEven ? semester2Int : semester1Int;

  const [selectedMonth, setSelectedMonth] = useState<string | number>(selectedSemesterInt.includes(currentMonth) ? currentMonth : selectedSemesterInt[5]);

  const monthSelection = selectedSemester?.map((item) => (
    <StyledMenuItem key={item.value} value={item.value}>{item.month}</StyledMenuItem>
  ));

  return(
    <Card sx={{height:'200px', borderRadius:'16px'}}>
      <Grid container spacing={0}>
        
        <Grid item xs={6}>
          <CardHeader title={header}  subheader={subheader} titleTypographyProps={{variant:'subtitle2'}} /> 
          <Box sx={{ p: 3, pb: 2 }} dir="ltr">
            <Grid container direction="column">
              <StyledFormControl>
                <StyledSelect sx={{height:'35px'}} defaultValue={selectedMonth} onChange={(e: any) => setSelectedMonth(e.target.value)}>
                  {monthSelection}
                </StyledSelect>
              </StyledFormControl>
                
                <Button 
                  variant='contained' 
                  size='small'
                  endIcon={<Iconify icon="solar:download-bold" />} 
                  disabled={loading}
                  sx={{mt: 2, width: 'fit-content'}}
                  onClick={handleDownloadFile}
                >
                  Zip
                </Button>
            </Grid>                      
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box sx={{ overflow:'hidden',  display:'flex', height:'100%', width:'100%', background:'cover', alignContent: 'center', alignItems: 'center'}}>
            <img src={image}  style={{ maxHeight:'100%', width: '90%', borderRadius:'12px'}}  />
          </Box>
        </Grid>

      </Grid>
    </Card>
  )
}

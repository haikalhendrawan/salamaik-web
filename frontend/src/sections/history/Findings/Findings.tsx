import {useState} from 'react';
import { useSearchParams } from 'react-router-dom';
import {Card, Typography, Grid, CardContent, Stack, Accordion, AccordionSummary, AccordionDetails, Button} from '@mui/material';
import {styled} from '@mui/material/styles';
import AmountBarChart from './components/AmountBarChart';
import FindingsDetail from './components/FindingsDetail';
import useDictionary from '../../../hooks/useDictionary';
import { useEffect } from 'react';
import useAxiosJWT from '../../../hooks/useAxiosJWT';
import Iconify from '../../../components/iconify';
import useSnackbar from '../../../hooks/display/useSnackbar';
import ExcelPrintout from './components/ExcelPrintout';
import AmountPieChart from './components/AmountPieChart';
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

const StyledButton = styled(Button)(({  }) => ({
  height: '30px', 
  width: '90px', 
  fontSize:'12px', 
  display: 'inline-flex',   
  alignItems: 'center', 
  justifyContent: 'center', 
  paddingRight: 0,
  paddingLeft: 0,
  borderRadius: '8px'
})) as typeof Button; 
// -----------------------------------------------------------------------

export default function Findings({selectedUnit, selectedPeriod}:FindingsProps) {
  const {komponenRef, periodRef, kppnRef, subKomponenRef} = useDictionary();

  const [searchParams, setSearchParams] = useSearchParams();

  const axiosJWT = useAxiosJWT();

  const {openSnackbar} = useSnackbar();

  const showGraph = searchParams.get("showGraph") === "1";

  const showDetail = searchParams.get("showDetail") === "1";

  const komponenRefStringArray = komponenRef?.map((item) => item.alias) || [];

  const [findingsData, setFindingsData] = useState<FindingsWithChecklist[]>([]);

  const last2PeriodList =  periodRef?.list.filter((item) => item.id === selectedPeriod || item.id === selectedPeriod-1)|| [];

  const unitString = kppnRef?.list.filter((item) => item.id === selectedUnit)?.[0]?.alias || '';

  const periodString = periodRef?.list.filter((item) => item.id === selectedPeriod)?.[0]?.name || '';

  const currentPeriodFindings = findingsData?.filter((f) => f.period === selectedPeriod) || [];

  const rekapFinding = komponenRef?.map((item) => ({
    komponen: item.title,
    totalFindingKomponen: currentPeriodFindings?.filter((f) => f.komponen_id === item.id)?.length || 0,
    subkomponen: subKomponenRef?.filter((sub) => sub.komponen_id === item.id)?.map((sub) => ({
      subTitle : sub.title,
      subAmount: currentPeriodFindings?.filter((f) => f.subkomponen_id === sub.id)?.length || 0
    }))
  }));

  const getFindings = async() => {
    try{
      const response3 = await axiosJWT.get('/getAllFindingsByKPPN/'+ selectedUnit);
      console.log(response3.data.rows);
      setFindingsData(response3.data.rows);
    }catch(err:any){
      openSnackbar(err.response.data.message, 'error');
    }
  };

  const last2PeriodFindings = last2PeriodList?.map((item) => {
    const findingsPerKomponen = komponenRef?.map((k) => {
      return findingsData?.filter((f) => (f.komponen_id === k.id) && (f.period === item.id))?.length || 0;
    });

    const totalFinding = findingsPerKomponen?.reduce((a, b) => a + b, 0);

    return {
      name: `${item.name || ""} (${totalFinding} Permasalahan)`,
      periodName: item.name || "",
      type: 'bar',
      fill: 'gradient',
      data: findingsPerKomponen || []
    }
  }) || [];

  
  useEffect(() => {
    getFindings();
  }, [selectedPeriod, selectedUnit]);

  return (
    showDetail
      ? <FindingsDetail hideDetail={() => setSearchParams((prev) => {
        prev.set("showDetail", "0")
        return prev
      })} periodId={selectedPeriod} kppnId={selectedUnit}/> 
      :
        <Card>
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} md={12}>
                <Stack direction={'row'} justifyContent={'space-between'}>
                  <Stack>
                    <Typography variant='h6'>{`Rekapitulasi Permasalahan`} </Typography>
                    <Typography variant='body3'>{`${unitString}, Periode ${periodString}`} </Typography>
                  </Stack>
                  <ExcelPrintout kppnId={selectedUnit} period={selectedPeriod} />
                </Stack>

                <Stack marginTop={4} marginBottom={4}>
                  <Stack direction={'row'} justifyContent={'center'} textAlign={'center'} marginBottom={2}>
                    <Typography variant="body2">{`Total Permasalahan: ${currentPeriodFindings?.length}` }</Typography>
                  </Stack>
                  {
                    rekapFinding?.map((item, index) => (
                      <Accordion key={index}>
                        <AccordionSummary
                          aria-controls="panel1-content"
                          id="panel1-header"
                          expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                          sx={{ pb: 0}}
                        >
                          <Typography variant="body1" marginRight={1} fontWeight={'bold'}>{item.komponen}</Typography>
                          <Typography variant="body3" color={'primary'}>({item.totalFindingKomponen})</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container>
                            <Typography variant="body2">{`Subkomponen: ` }</Typography>
                              {item.subkomponen?.map((sub, i) => (
                                  <Grid container marginLeft={2} key={i}>
                                    <Grid item xs={6}>
                                      <Stack direction="row" spacing={1}>
                                        <Typography variant="body2">{`${i+1}.` }</Typography>
                                        <Typography variant="body2">{`${sub.subTitle}` }</Typography>
                                      </Stack>
                                    </Grid>
                                    <Grid item xs={2}>
                                      <Typography variant="body3" color={sub.subAmount > 0 ? 'primary' : 'text.primary'}>{`: ${sub.subAmount}` }</Typography>
                                    </Grid>
                                  </Grid>
                                ))
                              }
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))
                  }

                </Stack>
                <Stack direction={'row'} justifyContent={'end'} spacing={1} marginBottom={4}>
                  <StyledButton
                    variant="contained" 
                    color={showGraph ? 'primary' : 'white'}
                    onClick = {() => setSearchParams((prev) => {
                      const prevShowGraph = prev.get("showGraph");
                      prev.set("showGraph", prevShowGraph === "1" ? "0" : "1")
                      return prev
                    })}
                  >
                    Grafik
                    <Iconify icon="solar:chart-2-bold" />
                  </StyledButton>
                  <StyledButton
                    variant="contained" 
                    color="warning"
                    onClick = {() => setSearchParams((prev) => {
                      prev.set("showDetail", "1")
                      return prev
                    })}
                  >
                    Detil
                    <Iconify icon="eva:arrow-ios-forward-outline" />
                  </StyledButton>
                </Stack>
                
                {
                  showGraph && (
                    <>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <AmountBarChart
                            title= "Tren Permasalahan"
                            subheader = {"2 periode terakhir"}
                            chartLabels={komponenRefStringArray}
                            chartData= {last2PeriodFindings}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <AmountPieChart
                            title= "Komposisi Permasalahan"
                            subheader = {`Periode ${last2PeriodFindings?.[0]?.periodName}` || ""}
                            chartLabels={komponenRefStringArray}
                            chartData= {last2PeriodFindings?.[0]?.data || []}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <AmountPieChart
                            title= "Komposisi Permasalahan"
                            subheader = {`Periode ${last2PeriodFindings?.[1]?.periodName}` || ""}
                            chartLabels={komponenRefStringArray}
                            chartData= {last2PeriodFindings?.[1]?.data || []}
                          />
                        </Grid>
                      </Grid>
                    </>
                  )
                }

              </Grid>
            </Grid>
          </CardContent>
        </Card>
  )
}

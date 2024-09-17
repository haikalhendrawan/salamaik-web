/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { Grid, Card, CardHeader, CardContent} from '@mui/material';
import Label from "../../../components/label";
import LinearProgressWithLabel from "../../../components/linear-progress-with-label/LinearProgressWithLabel";
// import useWorksheet from "../useWorksheet";

// --------------------------------------------------------
// interface WorksheetInfoProps {
//   batch?: any;
//   checklist?: any;
//   tabValue?: number;
// }

export default function WorksheetInfo(){

  // const {batch, checklist, tabValue} = props;
  
  const openPeriod = Math.floor(new Date('04/03/2024').getTime());
  const closePeriod = Math.floor(new Date('04/20/2024').getTime());
  const remainingMilisecond = closePeriod - openPeriod;
  const days = Math.floor(remainingMilisecond / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remainingMilisecond % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  const notDone = 15;
  const done = 24;
  const notDoneSection = 3;
  const doneSection = 12;
  const percentComplete = (done/(notDone+done)*100);
  const percentCompleteSection = (doneSection/(notDoneSection+doneSection)*100);

  const infoRows = [
    {col1:<Label color="success"> Open Period </Label>, col2:':', col3: new Date(openPeriod).toLocaleDateString('en-GB')},
    {col1:<Label color="error"> Close Period </Label>, col2:':', col3: new Date(closePeriod).toLocaleDateString('en-GB')},
    {col1:"Sisa Waktu", col2: ':', col3:`${days} Days ${hours} Hours`},
    {col1:"Progress Komponen", col2: ':', col3:<LinearProgressWithLabel value={percentCompleteSection} tooltip={`(${doneSection}/${doneSection+notDoneSection}) input bagian ini diselesaikan`}/>},
    {col1:"Progress Total", col2: ':', col3:<LinearProgressWithLabel value={percentComplete} tooltip={`(${done}/${done+notDone}) dari seluruh input diselesaikan`}/>},
  ];

  return(
    <Card>
      <CardHeader title={"Data Kertas Kerja"}  subheader="Metadata kertas kerja" />
        <CardContent sx={{fontSize:12}}>
          <Grid container spacing={2}>
          {infoRows.map((row, index) => {
            return(
              <Grid item container spacing={2} key={index}>
                <Grid item sm={4}>
                  {row.col1}
                </Grid>

                <Grid item sm={2}>
                  {row.col2}
                </Grid>

                <Grid item sm={6}>
                  {row.col3}
                </Grid>
              </Grid>
              )
            })
          }         
          </Grid>
          </CardContent>
    </Card>
  )
};




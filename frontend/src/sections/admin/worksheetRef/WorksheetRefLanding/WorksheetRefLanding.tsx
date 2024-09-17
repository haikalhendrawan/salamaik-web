/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {Slide, Card} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DasarHukumGrid from './DasarHukumGrid';
import WorksheetGrid from './WorksheetGrid';
import PeriodGrid from './PeriodGrid';
//---------------------------------------------------- 
interface WorksheetRefLandingProps {
  changeSection: (section: number) => void;
};

//-------------------------------------------------------
export default function WorksheetRefLanding({changeSection}: WorksheetRefLandingProps) {
  const theme = useTheme();

  return (
    <>
      <Slide direction="right" in mountOnEnter unmountOnExit>
        <Card sx={{minHeight:480, display:'flex', flexDirection:'column', gap:theme.spacing(1)}}>

          <DasarHukumGrid />

          <WorksheetGrid changeSection={changeSection}/>
         
          <PeriodGrid changeSection={changeSection}/>
        
        </Card>
      </Slide>
    </>
  );
};
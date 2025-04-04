/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */
import { Button} from '@mui/material';
import Iconify from '../../../../components/iconify/Iconify';
import FollowUpTable from './FollowUpTable';
import { DerivedFindingsType } from '../../../../types/findings.type';
// ---------------------------------------------------
interface FindingsDetailProps{
  isFinal: boolean | null,
  nonFinalFindings: DerivedFindingsType[] | null,
  finalFindings: DerivedFindingsType[] | null, 
  hideDetail: () => void,
  kppnId: string,
  periodId: number
}
// ---------------------------------------------------
export default function FindingsDetail({isFinal, nonFinalFindings, finalFindings, hideDetail, periodId, kppnId}: FindingsDetailProps) {
  return (
    <>  
        <Button onClick={hideDetail} startIcon={<Iconify icon="eva:arrow-ios-back-fill" />} variant='contained' color='white' sx={{mb: 2}}>Back</Button>
        <FollowUpTable isFinal={isFinal} nonFinalFindings={nonFinalFindings} finalFindings={finalFindings} kppnId={kppnId} period={periodId}/>
    </>

  )
}

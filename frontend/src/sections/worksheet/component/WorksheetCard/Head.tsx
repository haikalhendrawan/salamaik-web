import { Stack, Typography, IconButton, Tooltip, } from '@mui/material';
import Iconify from "../../../../components/iconify";
import { parseISO, format } from 'date-fns';
  // ------------------------------------------------------------
interface HeadPropInterface{
  num: number | undefined,
  title:string,
  dateUpdated: string | null,
  updatedBy: string | null
};
// ------------------------------------------------------------
export default function Head(props: HeadPropInterface) {  // bagian atas dari card
  const dateUpdated = props?.dateUpdated ? format(parseISO(props.dateUpdated), 'dd/MM/yyyy - HH:mm') : null;
  const tooltipText = <div>Last update: {dateUpdated} <br/> By: {props.updatedBy}</div>;
  const isUpdate = props?.dateUpdated;

  return(
  <>
  <Stack direction="row" spacing={2} sx={{justifyContent:'space-between', ml:1}}>
    <Stack direction="row" spacing={1} sx={{alignItems:'center'}}>
        <Typography variant="h6" sx={{ml:1, fontSize:14}}>{`${props.num}`}</Typography>
        <Stack >
            <Typography variant="body1" sx={{fontSize:15}}>{props.title}</Typography>
        </Stack>
    </Stack>
    {isUpdate?
      <Tooltip title={tooltipText} placement="left-start">
        <IconButton disableRipple><Iconify icon={"solar:check-circle-bold"} sx={{color:'rgb(0, 167, 111)', borderRadius:'50%'}} /></IconButton>
      </Tooltip>:
      null
    }

  </Stack>
  </>
  )
}
import { Stack, Typography, Grid, Card, CardHeader, IconButton, Tooltip, Select, MenuItem,
  FormControl, TextField, Grow, Divider, Badge, Box} from '@mui/material';
import Iconify from "../../../../components/iconify";
  // ------------------------------------------------------------
interface HeadPropInterface{
  num: number | undefined,
  title:string,
  dateUpdated: Date
};
// ------------------------------------------------------------
export default function Head(props: HeadPropInterface) {  // bagian atas dari card
  const date = new Date(props.dateUpdated).toLocaleDateString('en-GB');
  const time = new Date(props.dateUpdated).toLocaleTimeString('en-GB');
  const tooltipText = `Last update: ${date} (${time})`;
  const isUpdate = props.dateUpdated;

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
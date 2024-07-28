import Scrollbar from "../../../../components/scrollbar/Scrollbar";
import {Box, Typography} from "@mui/material";
import { OpsiType } from "../../types";

interface KriteriaProps{
    kriteria: string,
    opsi: OpsiType[] | [] | null
}

export default function Kriteria({kriteria, opsi}: KriteriaProps) {
  const descriptionText = opsi?.map((item, index) => (
    <tr style={{fontSize: 12, width: '100%'}} key={index}>
      <td style={{width: '10%', alignContent: 'start', justifyContent: 'start', alignItems: 'start', verticalAlign: 'top', textAlign: 'left'}}>
        <b>{item?.value !==undefined ? `Nilai ${item?.value}`: null}</b>
      </td>
      <td style={{width:'5%', verticalAlign: 'top'}}>
      {item?.value !==undefined ? `:`: null}
      </td>
      <td style={{width:'80%', justifyContent:'start', textAlign: 'justify'}}>
        {item?.title}
      </td>
    </tr>
  ));

  return(
    <Scrollbar  
      sx={{
        height: 150,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
        pl:4,
        pr:4
      }}
    >
      <Box>
        <Typography variant="body2" sx={{mr:1, mb:1, fontSize:13}} textAlign={'justify'}>
          {kriteria}
        </Typography>

        <table style={{tableLayout: 'fixed'}}>
          <tbody>
            {descriptionText}
          </tbody>
        </table>
      </Box> 
    </Scrollbar>
  )
}
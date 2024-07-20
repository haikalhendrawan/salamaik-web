import Scrollbar from "../../../../components/scrollbar/Scrollbar"
import {Box, Typography} from "@mui/material"

interface KriteriaProps{
  description: string
}

export default function Kriteria({description}: KriteriaProps) {
  return(
    <Scrollbar  sx={{
      height: 150,
      '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      pl:4,
      pr:4
    }}>
      <Box>
        <Typography variant="body2" sx={{mr:1, fontSize:13}} dangerouslySetInnerHTML={{__html:description}} textAlign={'justify'}/>
      </Box> 
    </Scrollbar>
  )
}
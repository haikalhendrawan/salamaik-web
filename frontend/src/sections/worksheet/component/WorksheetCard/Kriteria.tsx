import React, {useEffect, useState} from "react";
import Scrollbar from "../../../../components/scrollbar/Scrollbar";
import Skeleton  from "@mui/material/Skeleton";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { OpsiType } from "../../types";
// ------------------------------------------------------------
interface KriteriaProps{
    kriteria: string,
    opsi: OpsiType[] | [] | null
};

const tableStyle: React.CSSProperties = {
  tableLayout: 'fixed'
};

const rowStyle: React.CSSProperties = {
  fontSize: 12, 
  width: '100%'
};

const col1Style: React.CSSProperties = {
  width: '10%', 
  alignContent: 'start', 
  justifyContent: 'start', 
  alignItems: 'start', 
  verticalAlign: 'top', 
  textAlign: 'left'
};

const col2Style: React.CSSProperties = {
  width:'5%', 
  verticalAlign: 'top'
};

const col3Style: React.CSSProperties = {
  width:'80%', 
  justifyContent:'start', 
  textAlign: 'justify'
  
}; 

const scrollBarStyle={
  height: 150,
  '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
  pl:4,
  pr:4
};

const gradientOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '20px',
  background: `linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)`,
  pointerEvents: 'none' 
};

// ------------------------------------------------------------
export default function Kriteria({kriteria, opsi}: KriteriaProps) {
  const [isMounted, setIsMounted] = useState(true);

  const descriptionText = opsi?.map((item, index) => (
    <tr style={rowStyle} key={index}>
      <td style={col1Style}>
        <b>{item?.value !==undefined ? `Nilai ${item?.value}`: null}</b>
      </td>
      <td style={col2Style}>
      {item?.value !==undefined ? `:`: null}
      </td>
      <td style={col3Style}>
        {item?.title}
      </td>
    </tr>
  ));

  useEffect(() => {
    setIsMounted(false);
  }, []);

  if(isMounted) {
    return (
    <>
      <Box>
        <Skeleton variant="rounded" height={'1em'} width={'80%'} />
        <br/>
        <Skeleton variant="rounded" height={'1em'} width={'50%'} />
        <br/>
        <Skeleton variant="rounded" height={'1em'} width={'50%'} />
        <br/>
        <Skeleton variant="rounded" height={'1em'} width={'50%'} />
      </Box>

    </>
    )
  }

  return(
    <Box sx={{ position: 'relative' }}>
    <Scrollbar sx={scrollBarStyle}>
      <Box>
        <Typography variant="body2" fontSize={13} marginRight={1} marginBottom={1} textAlign='justify'>
          {kriteria}
        </Typography>

        <table style={tableStyle}>
          <tbody>
            {descriptionText}
          </tbody>
        </table>
        <br></br>
      </Box>
    </Scrollbar>

    {/* Gradient overlay */}
    <Box sx={gradientOverlayStyle} />
  </Box>
  )
}
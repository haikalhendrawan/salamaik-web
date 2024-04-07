/**
 * component progress bar dengan label % 
 * utk nunjukin progress pengisian kertas kerja
 */


import {Tooltip, Box, LinearProgress, Typography} from '@mui/material';

// -----------------------------------------------------------------
interface LinearProgressWithLabelProps {
  value: number;
  tooltip: string;
}

// -----------------------------------------------------------------
export default function LinearProgressWithLabel(props : LinearProgressWithLabelProps) {
  return (
    <Tooltip title={props.tooltip}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} sx={{borderRadius:'12px'}} />
        </Box>
        <Box sx={{ minWidth: 40 }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {`${Math.round(props.value,)}%`}
          </Typography>
        </Box>
    </Box>
    </Tooltip>
  );
};
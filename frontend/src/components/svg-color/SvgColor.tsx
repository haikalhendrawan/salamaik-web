import { forwardRef, ReactNode } from 'react';
// @mui
import { Box } from '@mui/material';
import {SxProps} from '@mui/material/styles';

// ----------------------------------------------------------------------
interface SvgColor {
  src: string;
  sx?: SxProps;
}

const SvgColor = forwardRef(({ src, sx, ...other }: SvgColor, ref) => (
  <Box
    component="span"
    className="svg-color"
    ref={ref}
    sx={{
      width: 24,
      height: 24,
      display: 'inline-block',
      bgcolor: 'currentColor',
      mask: `url(${src}) no-repeat center / contain`,
      WebkitMask: `url(${src}) no-repeat center / contain`,
      ...sx,
    }}
    {...other}
  />
));


export default SvgColor;

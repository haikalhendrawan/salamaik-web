/**
 *component icon. perlu specify height scr manual
 *
 */

import { forwardRef } from 'react';
// icons
import { Icon } from '@iconify/react';
// @mui
import { Box } from '@mui/material';

// ----------------------------------------------------------------------
interface IconifyProps {
  icon: string;
  width?: number | string;
  sx?: object;
  color?: string;
}


const Iconify = forwardRef(({ icon, width = 20, sx, ...other }:IconifyProps, ref) => (
  <Box ref={ref} component={Icon} icon={icon} sx={{ width, height: width, ...sx }} {...other} />
));


export default Iconify;

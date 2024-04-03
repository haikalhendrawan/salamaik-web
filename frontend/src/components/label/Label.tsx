/**
 *component label atau chip. Usually digunakan utk show status active or not
 *
 */


import { forwardRef, ReactNode } from 'react';
// @mui
import { ThemeOptions, SxProps, useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
//
import { StyledLabel } from './styles';

// ----------------------------------------------------------------------

interface Label{
  sx?: SxProps,
  endIcon?: ReactNode,
  children?: ReactNode,
  startIcon?: ReactNode,
  variant?: string,
  color?: string,
  onClick?:() => void
};

const Label = forwardRef(({ children, color = 'default', variant = 'soft', startIcon, endIcon, sx, ...other }:Label, ref) => {
  const theme = useTheme() as any;

  const iconStyle = {
    width: 16,
    height: 16,
    '& svg, img': { width: 1, height: 1, objectFit: 'cover' },
  };

  return (
    <StyledLabel
      ref={ref}
      component="span"
      ownerState={{ color, variant }}
      sx={{
        ...(startIcon && { pl: 0.75 }),
        ...(endIcon && { pr: 0.75 }),
        ...sx,
      }}
      theme={theme}
      {...other}
    >
      {startIcon && <Box sx={{ mr: 0.75, ...iconStyle }}> {startIcon} </Box>}

      {children}

      {endIcon && <Box sx={{ ml: 0.75, ...iconStyle }}> {endIcon} </Box>}
    </StyledLabel>
  );
});



export default Label;

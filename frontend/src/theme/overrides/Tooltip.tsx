/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

// ----------------------------------------------------------------------

export default function Tooltip(theme:any) {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.grey[800],
        },
        arrow: {
          color: theme.palette.grey[800],
        },
      },
    },
  };
}

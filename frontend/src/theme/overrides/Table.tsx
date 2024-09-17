/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

// ----------------------------------------------------------------------

export default function Table(theme:any) {
  return {
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.background.neutral,
        },
        root:{
          borderBottom:theme.palette.action.borderBottom
        }
      },
    },
  };
}

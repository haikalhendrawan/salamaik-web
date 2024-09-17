/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

// ----------------------------------------------------------------------

export default function Paper() {
  return {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  };
}

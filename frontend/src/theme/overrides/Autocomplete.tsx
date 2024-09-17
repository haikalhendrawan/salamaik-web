/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */
// ----------------------------------------------------------------------

export default function Autocomplete(theme: any) {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          boxShadow: theme.customShadows.z20,
        },
      },
    },
  };
}

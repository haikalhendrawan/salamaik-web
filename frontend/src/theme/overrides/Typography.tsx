// ----------------------------------------------------------------------

export default function Typography(theme:any) {
  return {
    MuiTypography: {
      styleOverrides: {
        paragraph: {
          marginBottom: theme.spacing(2),
        },
        gutterBottom: {
          marginBottom: theme.spacing(1),
        },
        body3:{
          color:theme.palette.text.secondary
        }
      },
    },
  };
}

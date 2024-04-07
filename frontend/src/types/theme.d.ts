import { ThemeOptions} from '@material-ui/core/styles';

interface CustomShadows{
  z1: string,
  z4: string,
  z8: string,
  z12: string,
  z16: string,
  z20: string,
  z24:string,
  //
  primary: string,
  info: string,
  secondary: string,
  success: string,
  warning: string,
  error: string,
  //
  card: string,
  dialog: string,
  dropdown: string,
}

// ----------------------------------------------------------------------
type Shadows = any[]

// ----------------------------------------------------------------------
interface TypographyVariant {
fontWeight?: number;
lineHeight?: number | string;
fontSize?: string;
[key: string]: number | string | Record<string, string>;
}

interface Typography{
fontFamily: string;
fontWeightRegular: number;
fontWeightMedium: number;
fontWeightBold: number;
h1: TypographyVariant;
h2: TypographyVariant;
h3: TypographyVariant;
h4: TypographyVariant;
h5: TypographyVariant;
h6: TypographyVariant;
subtitle1: TypographyVariant;
subtitle2: TypographyVariant;
body1: TypographyVariant;
body2: TypographyVariant;
body3:TypographyVariant;
caption: TypographyVariant;
overline: TypographyVariant;
button: TypographyVariant;
}

// ----------------------------------------------------------------------
interface Shape{
borderRadius: number;
}

// ----------------------------------------------------------------------
interface Color{
[key: string]:string
}

interface Palette{
common: Color, 
primary: Color,
secondary: Color,
info: Color,
success: Color,
warning: Color,
error: Color,
grey: Color,
pink: Color,
white: Color,
divider: string,
text: Color,
background: Color,
action: {
  active: string;
  hover: string;
  selected: string;
  disabled: string;
  disabledBackground: string;
  focus: string;
};
mode?: PaletteMode | undefined
}

export interface CustomThemeOptions extends ThemeOptions{
  palette: Palette,
  shape: Shape,
  typography: Typography,
  customShadows: CustomShadows
}


declare module '@mui/material/styles'{
  export interface Theme{
    palette: Palette,
    shape: Shape,
    typography: Typography,
    customShadows: CustomShadows
  } 

  export interface ThemeOptions{
    palette: Palette,
    shape: Shape,
    typography: Typography,
    customShadows: CustomShadows
  } 

  export interface TypographyVariants {
    body3: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  export interface TypographyVariantsOptions {
    body3?: React.CSSProperties;
  }

}

declare module '@emotion/react'{
  export interface Theme extends CustomThemeOptions{}
}

declare module '@mui/material/Typography' {
  export interface TypographyPropsVariantOverrides {
    body3: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    pink: true;
    white: true;
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    pink: true;
    white: true;
  }
}


export {}
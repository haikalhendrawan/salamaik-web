export interface CustomShadows{
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
export type Shadows = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
]

// ----------------------------------------------------------------------
interface TypographyVariant {
  fontWeight: number;
  lineHeight: number | string;
  fontSize: string;
  [key: string]: number | string;
}

export interface Typography{
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
  caption: TypographyVariant;
  overline: TypographyVariant;
  button: TypographyVariant;
}

// ----------------------------------------------------------------------
export interface Shape{
  borderRadius: number;
}

// ----------------------------------------------------------------------
interface Color{
  [key: string]:string
}

export interface Palette{
  common: Color, 
  primary: Color,
  secondary: Color,
  info: Color,
  success: Color,
  warning: Color,
  error: Color,
  grey: Color,
  divider: string,
  text: Color,
  background: Color,
  action: Color,
}
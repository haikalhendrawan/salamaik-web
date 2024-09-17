/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

// SETUP COLORS
const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

const PRIMARY = {
  lighter: '#D1E9FC',
  light: '#76B0F1',
  main: '#2065D1',
  dark: '#103996',
  darker: '#061B64',
  contrastText: '#fff',
  name:'primary'
};

const SECONDARY = {
  lighter: '#D6E4FF',
  light: '#84A9FF',
  main: '#3366FF',
  dark: '#1939B7',
  darker: '#091A7A',
  contrastText: '#fff',
  name:'secondary'
};

const INFO = {
  lighter: '#D0F2FF',
  light: '#74CAFF',
  main: '#1890FF',
  dark: '#0C53B7',
  darker: '#04297A',
  contrastText: '#fff',
  name:'info'
};

const SUCCESS = {
  lighter: '#E9FCD4',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  darker: '#08660D',
  contrastText: GREY[800],
  name:'success'
};

const WARNING = {
  lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#FFC107',
  dark: '#B78103',
  darker: '#7A4F01',
  contrastText: GREY[800],
  name:'warning'
};

const ERROR = {
  lighter: '#FFE7D9',
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  darker: '#7A0C2E',
  contrastText: '#fff',
  name:'error'
};

const GREEN = {
  lighter: 'rgb(221, 255, 217)',
  light: 'rgb(91, 228, 155)',
  main: 'rgb(0, 167, 111)',
  dark: 'rgb(0, 75, 80)',
  darker: 'rgb(0, 75, 80)',
  contrastText: '#fff',
  name:'green'
};

const PURPLE = {
  lighter: 'rgb(251, 217, 255)',
  light: 'rgb(185, 133, 244)',
  main: '#9c27b0',
  dark: 'rgb(32, 10, 105)',
  darker: 'rgb(32, 10, 105)',
  contrastText: '#fff',
  name:'purple'
};

const PINK = {
  lighter: '#fde3e8',
  light: '#f48ba0',
  main: '#e11d47',
  dark: '#bd1143',
  darker: '#86003c',
  contrastText: '#fff',
  name:'pink'
}

const WHITE = {
  lighter: '#fff',
  light: '#fff',
  main: '#fff',
  dark: GREY[300],
  darker: GREY[400],
  contrastText: GREY[800],
  name:'white'  
}

const palette = {
  common: { black: '#000', white: '#fff' }, 
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  pink: PINK,
  white:WHITE,
  divider: alpha(GREY[500], 0.24),
  text: {
    primary: GREY[800],
    secondary: GREY[600],
    disabled: GREY[500],
    tertiary: GREY[600]
  },
  background: {
    paper: '#fff',
    default: GREY[100],
    neutral: GREY[200],
  },
  action: {
    active: GREY[600],
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
  mode:'light'
};

const paletteDark = {
  common: { black: '#000', white: '#fff' },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  pink: PINK,
  white:WHITE,
  divider: alpha(GREY[500], 0.24),
  text: {
    primary: 'rgb(255, 255, 255)',
    secondary: 'rgb(145, 158, 171)',
    disabled: 'rgba(255, 255, 255, 0.5)',
    tertiary:'rgba(255, 255, 255, 0.7)'
  },
  background: {
    paper: 'rgb(33, 43, 54)',
    default: "rgb(22, 28, 36)",
    neutral: 'rgba(145, 158, 171, 0.12)',
  },
  action: {
    active: GREY[600],
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
    borderBottom:'1px dashed rgb(46, 50, 54)'
  },
  mode:'dark'
};

export default palette;
export {paletteDark, GREY, PRIMARY, SECONDARY, INFO, SUCCESS, WARNING, ERROR, GREEN, PURPLE, PINK};

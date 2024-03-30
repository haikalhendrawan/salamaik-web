import PropTypes from 'prop-types';
import { useMemo, useState, createContext, useEffect } from 'react';
// @mui
import { CssBaseline} from '@mui/material';
import { ThemeProvider as MUIThemeProvider, createTheme, StyledEngineProvider, Theme, ThemeOptions} from '@mui/material/styles';
import { CustomThemeOptions } from '../types/theme';
import { idID, zhCN } from '@mui/material/locale';
//
import palette, {paletteDark, GREY, PRIMARY, SECONDARY, INFO, SUCCESS, WARNING, ERROR} from './palette';
import shadows from './shadows';
import typography from './typography';
import GlobalStyles from './globalStyles';
import customShadows from './customShadows';
import componentsOverride from './overrides';
import useMode, {ModeContext} from "../hooks/display/useMode";
// import { CustomShadows, Shadows, Typography, Shape, Palette } from '../types/themeTypes';

// ----------------------------------------------------------------------

interface ThemeProvider{
  children:JSX.Element | JSX.Element[]
}

export default function ThemeProvider({ children }:ThemeProvider) {
  const [mode, setMode] = useState('dark');
  const [primaryColor, setPrimaryColor] = useState('primary'); 
  const currentColor = localStorage.getItem('color') || null;
  const themeOptions = useMemo(() => ({
      palette: {
        ...localStorage.getItem('mode') === 'light' ? palette : paletteDark,
        primary: currentColor?JSON.parse(currentColor):PRIMARY,
      },
      shape: { borderRadius: 6 },
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
    }),[mode, primaryColor]
  ) as CustomThemeOptions;

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <ModeContext.Provider value={{mode, setMode, primaryColor, setPrimaryColor}}>
        {children}
        </ModeContext.Provider>
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}

export {ModeContext};

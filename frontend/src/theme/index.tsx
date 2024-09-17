/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { useMemo} from 'react';
// @mui
import { CssBaseline} from '@mui/material';
import { ThemeProvider as MUIThemeProvider, createTheme, StyledEngineProvider} from '@mui/material/styles';
import { CustomThemeOptions } from '../types/theme';
//
import palette, {paletteDark, PRIMARY, PINK} from './palette';
import shadows from './shadows';
import typography from './typography';
import GlobalStyles from './globalStyles';
import customShadows from './customShadows';
import componentsOverride from './overrides';
import {ModeContext} from "../hooks/display/useMode";
import useThemeColor from '../hooks/display/useThemeColor';
import useThemeMode from '../hooks/display/useThemeMode';

// ----------------------------------------------------------------------

interface ThemeProvider{
  children:JSX.Element | JSX.Element[]
};


export default function ThemeProvider({ children }:ThemeProvider) {
  const [mode, setMode] = useThemeMode('light');

  const [primaryColor, setPrimaryColor] = useThemeColor(PINK);

  const themeOptions = useMemo(() => ({
      mode: mode,
      color: primaryColor,
      palette: {
        ...mode === 'light' ? palette : paletteDark,
        primary: primaryColor??PRIMARY,
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

import { useState } from 'react'
import { BrowserRouter, RouterProvider} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// provider
import ThemeProvider from './theme';
import { AuthProvider } from './context/AuthProvider';
import { LoadingProvider } from './hooks/display/useLoading';
import { SnackbarProvider } from './hooks/display/useSnackbar';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';


function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <AuthProvider>
            <LoadingProvider>
              <SnackbarProvider>
                <Router />
              </SnackbarProvider>              
            </LoadingProvider>            
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App

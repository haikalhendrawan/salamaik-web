import { useState } from 'react'
import { BrowserRouter, RouterProvider} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// provider
import ThemeProvider from './theme';
// import {AuthProvider} from './context/AuthProvider';
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
            <Router />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App

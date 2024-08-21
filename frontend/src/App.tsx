import { BrowserRouter} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// provider
import ThemeProvider from './theme';
import { AuthProvider } from './context/AuthProvider';
import { SocketProvider } from './hooks/useSocket';
import { DictionaryProvider } from './hooks/useDictionary';
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
            <SocketProvider>
              <DictionaryProvider>
                <LoadingProvider>
                  <SnackbarProvider>
                    <Router />
                  </SnackbarProvider>              
                </LoadingProvider>     
              </DictionaryProvider>    
            </SocketProvider>
            </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App

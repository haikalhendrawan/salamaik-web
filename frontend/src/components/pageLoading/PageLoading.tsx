import { useState, useEffect } from 'react';
import { Container,Typography, Box, LinearProgress} from '@mui/material';
import {styled} from '@mui/material/styles';

/** 
 * 
 * Menampilkan loading yg bentuknya linear progress bar
 * Selain komponen ini, juga ada global loading state di folder hooks
 * Bedanya komponen ini, digunain untuk local loading di masing2 page
 * fungsi utamanya utk fix performance issue saat render komponen berat
 * @param duration pass dalam satuan second, atur lama progress bar
 * */
const ProgressContainer = styled(Box)(({ theme }) => ({
  height: '70vh', 
  display:'flex', 
  flexDirection:'column', 
  alignItems: 'center', 
  justifyContent: 'center'
}));

type PageLoadingProps = {
  duration: number
};

export default function PageLoading({ duration }:PageLoadingProps){
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: number;
    let progressTimer: number;

    const startLoading = () => {
      timer = window.setTimeout(() => {
        clearInterval(progressTimer);
        setProgress(95);
      }, duration * 1000);

      progressTimer = window.setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            return 100;
          }
          const diff = 100 / (duration * 10);
          return Math.min(oldProgress + diff, 100);
        });
      }, duration * 100);
    };

    startLoading();

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [duration]);
  return(
    <>
      <Container>
        <ProgressContainer>
          <LinearProgress variant="determinate" value={progress} sx={{width: "40%", height:'1vh', borderRadius:'12px', mb: 3}}/>
          <Typography variant='body2' color='text.secondary'>Fetching data..</Typography>
        </ProgressContainer> 
      </Container>
    </>
  )
}
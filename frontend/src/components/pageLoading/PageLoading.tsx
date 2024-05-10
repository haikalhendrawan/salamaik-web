import { useState, useEffect } from 'react';
import { Container,Typography, Box, LinearProgress} from '@mui/material';
import {styled} from '@mui/material/styles';

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

export default function PageLoading({ duration}:PageLoadingProps){
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: any;
    let progressTimer: any;

    const startLoading = () => {
      timer = setTimeout(() => {
        clearInterval(progressTimer);
        setProgress(100);
      }, duration * 1000);

      progressTimer = setInterval(() => {
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
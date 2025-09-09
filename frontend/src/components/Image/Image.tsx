/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState} from 'react';
import { Skeleton, Box } from '@mui/material';

interface ImageProps{
    src: string,
    width: string | number,
    height: string | number,
    maxWidth?: string | number,
    maxHeight?: string | number
}

export default function Image({src, width, height, maxWidth, maxHeight}: ImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <>
      <Box sx={{ overflow:'hidden', display:'flex', height, width, background:'cover', alignContent: 'center', alignItems: 'center'}}>
        {
          imageLoaded
          ? null
          :<Skeleton variant="rounded" sx={{position:'absolute', width, height, maxWidth, maxHeight}} />
        }
        <img 
          src={src} 
          style={{ height: '100%', width: '100%', borderRadius:'12px'}} 
          onLoad={handleImageLoad}
        />
      </Box>
    </>
  )
}
  
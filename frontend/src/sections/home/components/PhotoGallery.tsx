// @mui
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Card, Typography, Grid, Button, Box, Stack } from '@mui/material';
import ImageSlider from '../../../components/ImageSlider';
// -----------------------------------------------------------------------

interface PhotoGalleryProps{
  images?: string[],
  title?: string,
  height?: string
}

// --------------------------------------------------------------------------
export default function PhotoGallery({title, images, height}: PhotoGalleryProps){
  return(
    <ImageSlider title={title} images={images} height={height} />
  )
}
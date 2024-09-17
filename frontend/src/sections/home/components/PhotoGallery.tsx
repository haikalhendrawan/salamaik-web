/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

// @mui
import ImageSlider from '../../../components/ImageSlider';
// -----------------------------------------------------------------------

interface PhotoGalleryProps{
  images: string[] | [],
  title?: string,
  height?: string
}

// --------------------------------------------------------------------------
export default function PhotoGallery({title, images, height}: PhotoGalleryProps){
  return(
    <ImageSlider title={title} images={images} height={height} />
  )
}
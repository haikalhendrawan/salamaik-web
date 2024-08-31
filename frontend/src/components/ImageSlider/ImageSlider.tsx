import { useState, useRef } from "react";
import Slider from "react-slick";
import { Card, IconButton, Stack, Box, Typography, Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Iconify from "../iconify/Iconify";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// ----------------------------------------------------
interface ImageSliderProps{
  images?: string[],
  title?: string,
  height?: string
}


// ----------------------------------------------------
export default function ImageSlider({images, title, height}: ImageSliderProps) {
  const theme = useTheme();

  const [_, setCurrent] = useState<number>(0); // current index dari image di carousel

  const [slideCounter, setSlideCounter] = useState<number>(0); // total counter image ber ganti

  // const [circleIndex, setCircleIndex] = useState<number>(0);

  // const length = images? images.length : 0

  const slider = useRef<any>(null);

  const baseUrl = `${import.meta.env.VITE_API_URL}/image`;

  const settings = {
    dots: false,
    infinite: true,
    arrows: false,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (prev: number, next: number) => {
      setCurrent(next);
  
      const diff = next - prev;
  
      if (Math.abs(diff) === 1) {
        setSlideCounter((prev) => prev + diff);
      } else {
        setSlideCounter((prev) => prev - diff);
      }
    },
    afterChange: () => {
      
    },
  };

  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // const toIndex = (slideCounter: number, length: number, currCircle: number, circleIndex: number) => {
  //   const difference = circleIndex - currCircle;
  //   return (slideCounter + difference) % length
  // };


  return (
      <Card style={{height:height, objectFit: 'cover', overflow:'hidden', position:'relative'}}>
        <Slider ref={slider} {...settings}>
          {
            imageLoaded
            ? null
            :(
              <Box key={0} sx={{width:'100%', height:'100%', color:theme.palette.common.black}}>
                <Skeleton variant="rounded" style={{width:'100%', height:height, objectFit: 'cover'}} />
              </Box> 
              )
          }
          {images?.map((item, index) => (
            <Box key={index+1} sx={{width:'100%', height:'100%', color:theme.palette.common.black}}>
              <img onLoad={handleImageLoad} src={`${baseUrl}/${item}`} style={{width:'100%', height:height, objectFit: 'cover'}} alt={item} loading="lazy"/>
            </Box> 
            ))
          }
        </Slider>

        <Stack direction='row' sx={{zIndex:9999, position: 'absolute', top:10}}>
          <IconButton 
            onClick={async() => {
              if(slideCounter<=0){
                slider.current.slickGoTo(0);
              }else{
                await slider?.current?.slickPrev(); 
                // setSlideCounter((prev) => prev-=2);
              }
            }}
            color='white'
          > 
            <Iconify icon={"eva:arrow-ios-back-outline"} />
          </IconButton>
          <IconButton 
            onClick={async() => {
              await slider?.current?.slickNext();
            }}
            color='white'
          >
            <Iconify icon={"eva:arrow-ios-forward-outline"} />
          </IconButton>
        </Stack>

        <Stack 
          direction='column' 
          sx={{
            zIndex:9999, 
            position: 'absolute', 
            bottom:0,  
            width:'100%', 
            height:'40px',
            backgroundColor:'black',
            border:'none',
            opacity: 0.8, 
            boxShadow: '0 0 10px 10px #000'
              }}>
          <Typography variant='body1' sx={{color:theme.palette.common.white, fontWeight: 'bold', pl:2}}> {title} </Typography>
        </Stack>

        <Stack direction='row' sx={{zIndex:9999, position: 'absolute', top:10, right:10}} spacing={0}>

        <IconButton
          key={0}
          sx={{color: slideCounter % 4 === 0 ? theme.palette.primary.main:theme.palette.primary.light}}
          // onClick={async() => {
          //   slider?.current?.slickGoTo(toIndex(slideCounter, length, circleIndex, 0));
          //   setSlideCounter(prev => prev-=1);
          //   setCircleIndex(0);
          //   const currCircle = 0;
          //   const pastCircle = circleIndex;
          //   setSlideCounter(prev => prev + (currCircle - pastCircle));
          //   // await slider.current.slickPrev()
          // }}
        >
          <Iconify icon={"carbon:dot-mark"} sx={{borderRadius:'50%'}}/>
        </IconButton>

        <IconButton
          key={1}
          sx={{color: slideCounter % 4 === 1 ? theme.palette.primary.main:theme.palette.primary.light}}
          // onClick={() => {
          //   slider?.current?.slickGoTo(toIndex(slideCounter, length, circleIndex, 1));
          //   setSlideCounter(prev => prev-=1);
          //   setCircleIndex(1);
          //   const currCircle = 1;
          //   const pastCircle = circleIndex;
          //   setSlideCounter(prev => prev + (currCircle - pastCircle));
          // }}
        >
          <Iconify icon={"carbon:dot-mark"} sx={{borderRadius:'50%'}}/>
        </IconButton>

        <IconButton
          key={2}
          sx={{color: slideCounter % 4 === 2 ? theme.palette.primary.main:theme.palette.primary.light}}
          // onClick={() => {
          //   slider?.current?.slickGoTo(toIndex(slideCounter, length, circleIndex, 2));
          //   setSlideCounter(prev => prev-=1);
          //   setCircleIndex(2);
          //   const currCircle = 2;
          //   const pastCircle = circleIndex;
          //   setSlideCounter(prev => prev + (currCircle - pastCircle));
          // }}
        >
          <Iconify icon={"carbon:dot-mark"} sx={{borderRadius:'50%'}}/>
        </IconButton>

        <IconButton
          key={3}
          sx={{color: slideCounter % 4 === 3 ? theme.palette.primary.main:theme.palette.primary.light}}
            // onClick={() => {
            //   slider?.current?.slickGoTo(toIndex(slideCounter, length, circleIndex, 3));
            //   setSlideCounter(prev => prev-=1);
            //   setCircleIndex(3);
            //   const currCircle = 3;
            //   const pastCircle = circleIndex;
            //   setSlideCounter(prev => prev + (currCircle - pastCircle));
            // }}
        >
          <Iconify icon={"carbon:dot-mark"} sx={{borderRadius:'50%'}}/>
        </IconButton>

        </Stack>
        
      </Card>
    
    
  );
}
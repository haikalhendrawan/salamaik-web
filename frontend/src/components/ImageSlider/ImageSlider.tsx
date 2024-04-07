  import { useState, useRef } from "react";
  import Slider from "react-slick";
  import { Card, Grid, IconButton, Button, Stack, Box, Typography } from "@mui/material";
  import { useTheme } from "@mui/material/styles";
  import Iconify from "../iconify/Iconify";
  import "slick-carousel/slick/slick.css";
  import "slick-carousel/slick/slick-theme.css";

  export default function ImageSlider() {
    const theme = useTheme();

    const [current, setCurrent] = useState<number>(0);

    const slider = useRef<any>(null);

    const dotStyles = {
      color: theme.palette.primary.light,
      alignItems: "center",
    };

    const activeDotStyles = {
      color: theme.palette.primary.main,
      alignItems: "center",
    };

    const settings = {
      dots: false,
      infinite: true,
      arrows:false,
      autoplay: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      beforeChange: (prev: number, next: number) => setCurrent(next),
      customPaging: (i: number) => <IconButton style={i === current ? activeDotStyles : dotStyles}><Iconify icon={"carbon:dot-mark"} sx={{ borderRadius: '50%' }} /></IconButton>,
    };

    return (
      <Grid item spacing={1} sx={{borderRadius:'16px', height:'300px'}}>
        <Card style={{height:'300px', objectFit: 'cover', overflow:'hidden', position:'relative'}}>

          <Slider ref={slider} {...settings}>
            <Box sx={{width:'100%', height:'100%', color:theme.palette.common.black}}>
              <img src="/image/01.jpg" style={{width:'100%', height:'300px', objectFit: 'cover'}} alt='abc'/>
            </Box>  
            <Box sx={{width:'100%', height:'100%'}}>
              <img src="/image/02.jpg" style={{width:'100%', height:'300px', objectFit: 'cover'}} alt='abc'/>
            </Box>
            <Box sx={{width:'100%', height:'100%'}}>
              <img src="/image/03.jpg" style={{width:'100%', height:'300px', objectFit: 'cover'}} alt='abc'/>
            </Box>
            <Box sx={{width:'100%', height:'100%'}}>
              <img src="/image/04.jpg" style={{width:'100%', height:'300px', objectFit: 'cover'}} alt='abc'/>
            </Box>
          </Slider>

          <Stack direction='row' sx={{zIndex:9999, position: 'absolute', top:10}}>
            <IconButton 
              onClick={() => slider?.current?.slickPrev()}
              color='white'
            > 
              <Iconify icon={"eva:arrow-ios-back-outline"} />
            </IconButton>
            <IconButton 
              onClick={() => slider?.current?.slickNext()}
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
            <Typography variant='body1' sx={{color:theme.palette.common.white, pl:2}}> Sudut Galeri</Typography>
          </Stack>

          <Stack direction='row' sx={{zIndex:9999, position: 'absolute', top:10, right:10}} spacing={0}>
            <IconButton 
              style={0 === current ? activeDotStyles : dotStyles}
              onClick={() => slider?.current?.slickGoTo(0)}
            >
              <Iconify icon={"carbon:dot-mark"} sx={{ borderRadius: '50%' }} />
            </IconButton>
            <IconButton 
              style={1 === current ? activeDotStyles : dotStyles}
              onClick={() => slider?.current?.slickGoTo(1)}
            >
              <Iconify icon={"carbon:dot-mark"} sx={{ borderRadius: '50%' }} />
            </IconButton>
            <IconButton 
              style={2 === current ? activeDotStyles : dotStyles}
              onClick={() => slider?.current?.slickGoTo(2)}
            >
              <Iconify icon={"carbon:dot-mark"} sx={{ borderRadius: '50%' }} />
            </IconButton>
            <IconButton 
              style={3 === current ? activeDotStyles : dotStyles}
              onClick={() => slider?.current?.slickGoTo(3)}
            >
              <Iconify icon={"carbon:dot-mark"} sx={{ borderRadius: '50%' }} />
            </IconButton>
          </Stack>
          
          
          
        </Card>
      </Grid>
      
      
    );
  }
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../components/iconify/Iconify';
import Label from '../../components/label/Label';
// @mui
import { Container, Stack, Typography, Box, Avatar,  Grid, IconButton, Card} from '@mui/material';
import { useTheme } from '@mui/material/styles';


export default function General(){
  const theme = useTheme();

  return (
    <>
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{height:500}}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ width: 1, height: "100%" }}
        >
          <input accept='image/*' type='file' style={{display:'none'}} tabIndex={-1} />
          <Box sx={{
            borderRadius:'50%', 
            height:'144px', 
            width:'144px', 
            p:'8px', 
            border:'1px dashed rgba(145, 158, 171, 0.2)',
            position: 'relative', 
            '&:hover .MuiTypography-root': { 
              color: 'white' 
            },
            '&:hover .backdrop': { 
              opacity: 0.5
            }
          }}
          >
            <IconButton 
              sx={{
                width:'100%', 
                height:'100%', 
                mx:'auto',
                cursor: 'pointer', 
                p:0, 
                backgroundImage: `url('/avatar/default-male.png')`, 
                backgroundSize: 'cover', 
              }}
            >
            <Typography
            variant='body2'
              sx={{
                  color: 'transparent', 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)', 
                  transition: 'color 0.3s ease', 
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              >
              Upload
              </Typography>
              <Box
                className='backdrop'
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'black',
                  opacity: 0, 
                  borderRadius: '50%', 
                  zIndex: 0, 
                  transition: 'opacity 0.3s ease'
                }}
              />
            </IconButton>
          
          </Box>

          <Stack direction="column"justifyContent="center"alignItems="center">
            <Typography variant='body2' color={theme.palette.text.disabled}>
              Muhammad Haikal Putra Hendrawan
            </Typography>
            <Typography variant='body2' color={theme.palette.text.disabled} sx={{mt:0}}>
              199904082021011001
            </Typography>
          </Stack>

          <Label color='success'>Active User</Label>
          <Typography variant='body2' color={theme.palette.text.disabled} sx={{mt:0}}>
              Role: Admin Kanwil
          </Typography>

        
        </Stack>
      </Card>
    </Grid>

    <Grid item xs={12} sm={6} md={8}>
      <Card sx={{height:550}}>
        B
      </Card>
    </Grid>
  </>
  )
}
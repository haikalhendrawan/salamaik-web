import {useState, useEffect} from'react';
import { Link } from 'react-router-dom';
import {Stack, Toolbar, Typography, Table, Card, CardHeader, TableSortLabel, Tooltip,
        TableHead, Grow, TableBody, TableRow, TableCell, Button} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify/Iconify';

// ---------------------------------------------------
const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 72,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  height: '30px', 
  width: '70px', 
  fontSize:'12px', 
  display: 'inline-flex',   
  alignItems: 'center', 
  justifyContent: 'center', 
  paddingRight: 0,
  paddingLeft: 0,
  borderRadius: '8px',
})) as typeof Button;  

const TABLE_HEAD = [
  { id: 'no', label: 'No', alignRight: false },
  { id: 'standar', label: 'Standar', alignRight: false },
  { id: 'jan', label: 'Jan', alignRight: false },
  { id: 'feb', label: 'Feb', alignRight: false },
  { id: 'mar', label: 'Mar', alignRight: false },
  { id: 'apr', label: 'Apr', alignRight: false },
  { id: 'Mei', label: 'Mei', alignRight: false },
  { id: 'jun', label: 'Jun', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

interface FollowUpData{
  id: number,
  standar: string,
  jan: number,
  feb: number, 
  mar: number,
  apr: number,
  mei: number,
  jun: number, 
};

const TABLE_DATA: FollowUpData[] = [
  {
    id: 0,
    standar: 'Morning Call Pegawai Internal',
    jan: 0,
    feb: 1, 
    mar: 2,
    apr: 3,
    mei: 4,
    jun: 5, 
  },
  {
    id: 1,
    standar: 'Capacity Building',
    jan: 0,
    feb: 1, 
    mar: 2,
    apr: 3,
    mei: 4,
    jun: 5, 
  },
  {
    id: 2,
    standar: 'Pengajian Bintal',
    jan: 0,
    feb: 1, 
    mar: 2,
    apr: 3,
    mei: 4,
    jun: 5, 
  },
];

const Checklist = (props: any) => (<Iconify icon={props.icon} sx={{cursor: 'pointer', color: props.color}} />);

// ----------------------------------------------------------------------------------
export default function StandardizationTable() {
  const theme = useTheme();

  return (
    <>
      <Grow in>
        <Card sx={{height:'auto', display:'flex', flexDirection:'column', gap:theme.spacing(1), mb: 1}}>
          <CardHeader title={<Typography variant='h6'>Tata Kelola Internal</Typography>} sx={{mb:2}}/>

          <Table>
            <TableHead>
              <TableRow>
                {TABLE_HEAD.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.alignRight ? 'right' : 'left'}
                  >
                    <TableSortLabel hideSortIcon>
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {TABLE_DATA.map((row) => 
                <TableRow hover key={row.id} tabIndex={-1}>
                  <TableCell align="justify" sx={{fontSize: '13px'}}>{row.id+1} </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    {row.standar}
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    {<Checklist color={theme.palette.success.dark} icon='solar:add-circle-bold'/>} 
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    {<Checklist color={theme.palette.success.dark} icon='solar:add-circle-bold'/>} 
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    {<Checklist color={theme.palette.success.dark} icon='solar:add-circle-bold'/>} 
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    {<Checklist color={theme.palette.grey[500]} icon='solar:add-circle-bold'/>} 
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                  <Stack direction='row' spacing={1} alignContent={'center'}>
                    {<Checklist color={theme.palette.success.dark} icon='solar:add-circle-bold'/>}
                    {<Checklist color={theme.palette.pink.main} icon='solar:add-circle-bold'/>}
                  </Stack>
                   
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    {<Checklist color={theme.palette.success.dark} icon='solar:add-circle-bold'/>} 
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    <ActionButton
                      endIcon={<Iconify icon="eva:arrow-ios-forward-outline" />} 
                      variant="contained" 
                      color="white"
                    >
                      Upload
                    </ActionButton>
                  </TableCell>

                </TableRow>
              )}

            </TableBody>
          </Table>
        </Card>
      </Grow>
    </>
  )
}
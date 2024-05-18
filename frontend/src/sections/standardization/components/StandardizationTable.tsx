import {useState, useEffect} from'react';
import { Link } from 'react-router-dom';
import {Stack, Toolbar, Typography, Table, Card, CardHeader, TableSortLabel, Tooltip,
        TableHead, Grow, TableBody, TableRow, TableCell, Button} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import useDictionary from '../../../hooks/useDictionary';
import { useAuth } from '../../../hooks/useAuth';
import Iconify from '../../../components/iconify/Iconify';
import useStandardization from '../useStandardization';
import AddButton from './AddButton';
import CheckButton from './CheckButton';


// ---------------------------------------------------
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

const TABLE_HEAD_ODD = [
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

const TABLE_HEAD_EVEN = [
  { id: 'no', label: 'No', alignRight: false },
  { id: 'standar', label: 'Standar', alignRight: false },
  { id: 'jul', label: 'Jul', alignRight: false },
  { id: 'agt', label: 'Agt', alignRight: false },
  { id: 'sept', label: 'Sept', alignRight: false },
  { id: 'oct', label: 'Oct', alignRight: false },
  { id: 'nov', label: 'Nov', alignRight: false },
  { id: 'dec', label: 'Dec', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

const INTERVAL_DESC = [
  "Minimal 1x tiap Bulan",
  "Minimal 2x tiap Bulan",
  "Minimal 4x tiap Bulan",
  "Minimal 20x tiap Bulan",
  "Minimal 1x tiap Triwulan",
  "Minimal 2x tiap Triwulan"
]

// ----------------------------------------------------------------------------------
export default function StandardizationTable() {
  const theme = useTheme();

  const {periodRef} = useDictionary();

  const {standardization} = useStandardization();

  const {auth} = useAuth();

  const isEvenPeriod = periodRef?.list?.filter((item) => item.id === auth?.period)?.[0]?.evenPeriod || 0;

  return (
    <>
      <Grow in>
        <Card sx={{height:'auto', display:'flex', flexDirection:'column', gap:theme.spacing(1), mb: 1}}>
          <CardHeader title={<Typography variant='h6'>Tata Kelola Internal</Typography>} sx={{mb:2}}/>

          <Table>
            <TableHead>
              <TableRow>
                {isEvenPeriod===0
                  ?TABLE_HEAD_ODD.map((headCell) => (
                        <TableCell
                          key={headCell.id}
                          align={'center'}
                        >
                          <TableSortLabel hideSortIcon>
                            {headCell.label}
                          </TableSortLabel>
                        </TableCell>
                      ))
                  :TABLE_HEAD_EVEN.map((headCell) => (
                        <TableCell
                          key={headCell.id}
                          align={'center'}
                        >
                          <TableSortLabel hideSortIcon>
                            {headCell.label}
                          </TableSortLabel>
                        </TableCell>
                      ))
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {standardization?.map((row) => {
                return(<TableRow hover key={row.id} tabIndex={-1}>
                  <TableCell align="justify" sx={{fontSize: '13px'}}>{row.id} </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                      <Typography variant='body2'>{row.title}</Typography>
                      <Typography variant='body3'>{INTERVAL_DESC[row.interval-1]}</Typography>
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    <Stack direction='row' spacing={1} alignContent={'center'}>
                      {row.list[0].length===0
                        ?<AddButton />
                        :<CheckButton />
                      } 
                    </Stack>
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    <Stack direction='row' spacing={1} alignContent={'center'}>
                      {row.list[1].length===0
                        ?<AddButton />
                        :<CheckButton />
                      } 
                    </Stack>
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    <Stack direction='row' spacing={1} alignContent={'center'}>
                      {row.list[2].length===0
                        ?<AddButton />
                        :<CheckButton />
                      } 
                    </Stack>
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    <Stack direction='row' spacing={1} alignContent={'center'}>
                      {row.list[3].length===0
                        ?<AddButton />
                        :<CheckButton />
                      } 
                    </Stack>
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    <Stack direction='row' spacing={1} alignContent={'center'}>
                      {row.list[4].length===0
                        ?<AddButton />
                        :<CheckButton />
                      } 
                    </Stack>
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    <Stack direction='row' spacing={1} alignContent={'center'}>
                      {row.list[5].length===0
                        ?<AddButton />
                        :<CheckButton />
                      } 
                    </Stack>
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

                </TableRow>)
              }
                
              )}

            </TableBody>
          </Table>
        </Card>
      </Grow>
    </>
  )
}
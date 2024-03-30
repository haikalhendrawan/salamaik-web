import {useState, useRef} from'react';
import {Stack, Button, Breadcrumbs, Link, Typography, Table, Card, IconButton, TableSortLabel,
          Tooltip, TableHead, Grow, TableBody, TableRow, TableCell} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../components/iconify';
import Label from '../../../components/label';
import StyledTextField from '../../../components/styledTextField/StyledTextField';
//----------------------------------------------------
const StyledButton = styled(Button)(({ theme }) => ({
  display: 'inline-flex',   
  alignItems: 'center', 
  justifyContent: 'center', 
  paddingRight: 0,
  paddingLeft: 0,
  minHeight: '30px',
  minWidth: '30px',
  borderRadius: '12px',
}));  

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'komponen', label: 'Nama Komponen', alignRight: false },
  { id: 'bobot', label: 'Bobot', alignRight: false },
  { id: 'checklist', label: 'Checklist', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

const TABLE_DATA = [
  {id:1, komponen:'Treasurer', bobot:20, numChecklist:10, action:'edit'},
  {id:2, komponen:'Pengelola Fiskal, Representasi Kemenkeu di Daerah, dan Special Mission', bobot:30, numChecklist:34, action:'edit'},
  {id:3, komponen:'Financial Advisor', bobot:20, numChecklist:5, action:'edit'},
  {id:4, komponen:'Tata Kelola Internal', bobot:30, numChecklist:17, action:'edit'},
]

interface KomponenRefProps {
  changeSection: (section: number) => void;
}

//-----------------------------------------------------------------------------------
export default function KomponenRef({changeSection}: KomponenRefProps) {
  const theme = useTheme();

  return (
    <>
      <Grow in>
        <Card sx={{minHeight:480, display:'flex', flexDirection:'column', gap:theme.spacing(1)}}>
          <Table>
            <TableHead>
              <TableRow>
                {TABLE_HEAD.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.alignRight ? 'right' : 'left'}
                    // sortDirection={orderBy === headCell.id ? order : false}
                  >
                    <TableSortLabel
                      hideSortIcon
                      // active={orderBy === headCell.id}
                      // direction={orderBy === headCell.id ? order : 'asc'}
                      // onClick={createSortHandler(headCell.id)}
                    >
                      {headCell.label}
                      {/* {orderBy === headCell.id ? (
                        <Box sx={{ ...visuallyHidden }}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</Box>
                      ) : null} */}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {TABLE_DATA.map((row) => 
                <TableRow hover key={0} tabIndex={-1}>
                  <TableCell align="justify">{row.id}</TableCell>

                  <TableCell align="left">{row.komponen}</TableCell>

                  <TableCell align="left">
                    <Label color={'success'}>
                    {`${row.bobot}%`}
                    </Label>
                  </TableCell>

                  <TableCell align="center">{row.numChecklist}</TableCell>

                  <TableCell align="justify">
                    <Stack direction='row' spacing={1}>
                      <Tooltip title='edit'>
                        <StyledButton aria-label="edit" variant='contained' size='small' color='warning'>
                          <Iconify icon="solar:pen-bold-duotone"/>
                        </StyledButton>
                      </Tooltip>
                      <Tooltip title='delete'>
                        <StyledButton aria-label="delete" disabled variant='contained' size='small' color='white'>
                          <Iconify icon="solar:trash-bin-trash-bold"/>
                        </StyledButton>
                      </Tooltip>
                    </Stack>
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
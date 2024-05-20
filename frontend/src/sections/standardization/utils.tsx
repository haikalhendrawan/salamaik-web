import {useState, useEffect, useMemo} from'react';
import { Link } from 'react-router-dom';
import {Stack, Toolbar, Typography, Table, Card, CardHeader, TableSortLabel, Tooltip,
        TableHead, Grow, TableBody, TableRow, TableCell, Button} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import useDictionary from '../../hooks/useDictionary';
import { useAuth } from '../../hooks/useAuth';
import Iconify from '../../components/iconify/Iconify';
import useStandardization from './useStandardization';
import usePreviewFileModal from './usePreviewFileModal';
import AddButton from './components/AddButton';
import CheckButton from './components/CheckButton';

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


const INTERVAL_DESC = [
  "Minimal 1x tiap Bulan",
  "Minimal 2x tiap Bulan",
  "Minimal 4x tiap Bulan",
  "Minimal 20x tiap Bulan",
  "Minimal 1x tiap Triwulan",
  "Minimal 2x tiap Triwulan"
];

interface StandardizationType{
  id: number;
  title: string;
  cluster: number;
  interval: number;
  list:[
    StandardizationJunctionType[],
    StandardizationJunctionType[],
    StandardizationJunctionType[],
    StandardizationJunctionType[],
    StandardizationJunctionType[],
    StandardizationJunctionType[]
  ]
};

interface StandardizationJunctionType{
  id: number;
  kppn_id: number;
  period_id: number;
  standardization_id: number
  month: number;
  file: string;
  uploaded_at: string
};


export function renderConditionalRow(
  standardization: StandardizationType[], 
  modalOpen: () => void,
  kppnTab: string
){
  const tableRows = useMemo(() => (
    standardization?.map((row, index) => (
      row.interval===1
      ? <TableRow hover key={row.id} tabIndex={-1}>
            <TableCell align="justify" sx={{ fontSize: '13px' }}>{index+1}</TableCell>
            <TableCell align="left" sx={{ fontSize: '13px' }}>
              <Typography variant="body2">{row.title}</Typography>
              <Typography variant="body3">{INTERVAL_DESC[row.interval - 1]}</Typography>
            </TableCell>
            {row.list.map((item, index) => (
              <TableCell key={index} align="center" sx={{ fontSize: '13px' }}>
                <Stack direction="row" spacing={0} alignContent="center" textAlign={'center'} justifyContent={'center'}>
                  {item.length === 0 
                    ? <AddButton kppn={kppnTab} standardizationId={row.id} month={index+1} /> 
                    : <CheckButton file={item[0].file} id={item[0].id}/>
                  }
                </Stack>
              </TableCell>
            ))}
            {/* <TableCell align="left" sx={{ fontSize: '13px' }}>
              <ActionButton
                endIcon={<Iconify icon="eva:arrow-ios-forward-outline" />}
                variant="contained"
                color="white"
                onClick={modalOpen}
              >
                Upload
              </ActionButton>
            </TableCell> */}
        </TableRow>
      : <TableRow hover key={row.id} tabIndex={-1}>
            <TableCell align="justify" sx={{ fontSize: '13px' }}>{index+1}</TableCell>
            <TableCell align="left" sx={{ fontSize: '13px' }}>
              <Typography variant="body2">{row.title}</Typography>
              <Typography variant="body3">{INTERVAL_DESC[row.interval - 1]}</Typography>
            </TableCell>
            {row.list.map((item, index) => (
              <TableCell key={index} align="center" sx={{ fontSize: '13px' }}>
                <Stack direction="row" spacing={0} alignContent="center">
                  {item.length === 0 
                    ? <>
                        <AddButton kppn={kppnTab} standardizationId={row.id} month={index+1} /> 
                        <AddButton kppn={kppnTab} standardizationId={row.id} month={index+1} />
                      </>
                    : <>
                        <CheckButton file={item[0].file} id={item[0].id}/>
                        <CheckButton file={item[0].file} id={item[0].id}/>
                      </>
                  }
                </Stack>
              </TableCell>
            ))}
            {/* <TableCell align="left" sx={{ fontSize: '13px' }}>
              <ActionButton
                endIcon={<Iconify icon="eva:arrow-ios-forward-outline" />}
                variant="contained"
                color="white"
                onClick={modalOpen}
              >
                Upload
              </ActionButton>
            </TableCell> */}
        </TableRow>

  ))
  ),[standardization]);


  return tableRows
}
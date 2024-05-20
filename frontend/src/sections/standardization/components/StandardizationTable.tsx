import {useState, useEffect, useMemo} from'react';
import { Link } from 'react-router-dom';
import {Stack, Toolbar, Typography, Table, Card, CardHeader, TableSortLabel, Tooltip,
        TableHead, Grow, TableBody, TableRow, TableCell, Button} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import useDictionary from '../../../hooks/useDictionary';
import { useAuth } from '../../../hooks/useAuth';
import Iconify from '../../../components/iconify/Iconify';
import useStandardization from '../useStandardization';
import usePreviewFileModal from '../usePreviewFileModal';
import AddButton from './AddButton';
import CheckButton from './CheckButton';
import { renderConditionalRow } from '../utils';


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

const TABLE_HEAD = {
  odd: [
    { id: 'no', label: 'No', alignRight: false },
    { id: 'standar', label: 'Standar', alignRight: false },
    { id: 'jan', label: 'Jan', alignRight: false },
    { id: 'feb', label: 'Feb', alignRight: false },
    { id: 'mar', label: 'Mar', alignRight: false },
    { id: 'apr', label: 'Apr', alignRight: false },
    { id: 'mei', label: 'Mei', alignRight: false },
    { id: 'jun', label: 'Jun', alignRight: false },
    // { id: 'action', label: 'Action', alignRight: false },
  ],
  even: [
    { id: 'no', label: 'No', alignRight: false },
    { id: 'standar', label: 'Standar', alignRight: false },
    { id: 'jul', label: 'Jul', alignRight: false },
    { id: 'agt', label: 'Agt', alignRight: false },
    { id: 'sept', label: 'Sept', alignRight: false },
    { id: 'oct', label: 'Oct', alignRight: false },
    { id: 'nov', label: 'Nov', alignRight: false },
    { id: 'dec', label: 'Dec', alignRight: false },
    // { id: 'action', label: 'Action', alignRight: false },
  ],
};

const INTERVAL_DESC = [
  "Minimal 1x tiap Bulan",
  "Minimal 2x tiap Bulan",
  "Minimal 4x tiap Bulan",
  "Minimal 20x tiap Bulan",
  "Minimal 1x tiap Triwulan",
  "Minimal 2x tiap Triwulan"
];

interface StandardizationTableProps{
  modalOpen: () => void,
  kppnTab: string,
  header: string,
  cluster: number
}

// ----------------------------------------------------------------------------------
export default function StandardizationTable({header, modalOpen, kppnTab, cluster}: StandardizationTableProps) {
  const theme = useTheme();

  const {periodRef} = useDictionary();

  const {standardization} = useStandardization();

  const {auth} = useAuth();

  const isEvenPeriod = periodRef?.list?.filter((item) => item.id === auth?.period)?.[0]?.evenPeriod || 0;

  const tableHeaders = isEvenPeriod === 0 ? TABLE_HEAD.odd : TABLE_HEAD.even;

  const tableHead = useMemo(() => tableHeaders.map((headCell) => (
    <TableCell key={headCell.id} align={'center'}>
      <TableSortLabel hideSortIcon>{headCell.label}</TableSortLabel>
    </TableCell>
  )),[isEvenPeriod]);

  const tableRows = useMemo(() => (
    standardization
    ?.filter((item) => item.cluster === cluster)
    ?.map((row, index) => (
      <TableRow hover key={row.id} tabIndex={-1}>
        <TableCell align="justify" sx={{ fontSize: '13px' }}>{index+1}</TableCell>
        <TableCell align="left" sx={{ fontSize: '13px' }}>
          <Typography variant="body2">{row.title}</Typography>
          <Typography variant="body3">{INTERVAL_DESC[row.interval - 1]}</Typography>
        </TableCell>
        {row.list.map((item, index) => (
          <TableCell key={index} align="left" sx={{ fontSize: '13px' }}>
            <Stack direction="row" spacing={1} alignContent="center">
              {item.length === 0 
                ? <AddButton kppn={kppnTab} standardizationId={row.id} month={index+1} /> 
                : <CheckButton file={item[0].file} id={item[0].id}/>
              }
            </Stack>
          </TableCell>
        ))}
        <TableCell align="left" sx={{ fontSize: '13px' }}>
          <ActionButton
            endIcon={<Iconify icon="eva:arrow-ios-forward-outline" />}
            variant="contained"
            color="white"
            onClick={modalOpen}
          >
            Upload
          </ActionButton>
        </TableCell>
      </TableRow>
    ))
  ), [standardization]);

  const clusteredStandardization = useMemo(() => standardization?.filter((item) => item.cluster === cluster), [standardization]);


  return (
    <>
      <Grow in>
        <Card sx={{height:'auto', display:'flex', flexDirection:'column', gap:theme.spacing(1), mb: 1}}>
          <CardHeader title={<Typography variant='h6'>{header}</Typography>} sx={{mb:2}}/>

          <Table>
            <TableHead>
              <TableRow>
              {tableHead}
              </TableRow>
            </TableHead>
            <TableBody>
              {renderConditionalRow(clusteredStandardization, modalOpen, kppnTab)}
            </TableBody>
          </Table>
        </Card>
      </Grow>
    </>
  )
}
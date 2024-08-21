import {useMemo} from'react';
import {Typography, Table, Card, CardHeader, TableSortLabel, 
        TableHead, Grow, TableBody, TableRow, TableCell, } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useDictionary from '../../../hooks/useDictionary';
import { useAuth } from '../../../hooks/useAuth';
import useStandardization from '../useStandardization';
import { renderConditionalRow } from '../utils';
// ---------------------------------------------------
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

  const isEvenPeriod = periodRef?.list?.filter((item) => item.id === auth?.period)?.[0]?.even_period || 0;

  const tableHeaders = isEvenPeriod === 0 ? TABLE_HEAD.odd : TABLE_HEAD.even;

  const tableHead = useMemo(() => tableHeaders.map((headCell) => (
    <TableCell key={headCell.id} align={'center'}>
      <TableSortLabel hideSortIcon>{headCell.label}</TableSortLabel>
    </TableCell>
  )),[isEvenPeriod]);

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
              {renderConditionalRow(clusteredStandardization, kppnTab)}
            </TableBody>
          </Table>
        </Card>
      </Grow>
    </>
  )
}
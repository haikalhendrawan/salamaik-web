/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

/**
 * Need To Refactor this code
 * maybe someday :))
 */
import { useMemo } from 'react';
import { TableRow, TableCell, Typography, Stack, Grid } from '@mui/material';
import AddButton from './components/AddButton';
import CheckButton from './components/CheckButton';
import { useAuth } from '../../hooks/useAuth';
import useDictionary from '../../hooks/useDictionary';
import { StandardizationType } from './types';
// --------------------------------------------------------------
const INTERVAL_DESC = [
  "Minimal 1x tiap Bulan",
  "Minimal 2x tiap Bulan",
  "Minimal 4x tiap Bulan",
  "Minimal 20x tiap Bulan",
  "Minimal 1x tiap Triwulan",
  "Minimal 2x tiap Triwulan"
];

const MONTH_NAME = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
]
// --------------------------------------------------------------
export function renderConditionalRow(
  standardization: StandardizationType[],
  kppnTab: string
) {

  const {auth} = useAuth();

  const {periodRef} = useDictionary();

  const isEvenPeriod = periodRef?.list?.filter((item) => item.id === auth?.period)?.[0]?.even_period || 0;

  const tableRows = useMemo(() =>
      standardization?.map((row, index) => {
        let content;
        switch (row.interval) {
          case 1: // bulanan (1x tiap bulan)
            content = (
              <TableRow hover key={row.id} tabIndex={-1}>
                <TableCell align="justify" sx={{ fontSize: '13px' }}>
                  {index + 1}
                </TableCell>
                <TableCell align="left" sx={{ fontSize: '13px' }}>
                  <Typography variant="body2">{row.title}</Typography>
                  <Typography variant="body3">{INTERVAL_DESC[row.interval - 1]}</Typography>
                  <Typography variant="body3" color="primary">{`, Nilai: ${row.score}`}</Typography>
                </TableCell>
                {row.list.map((item, id) => (
                  <TableCell key={id} align="center" sx={{ fontSize: '13px' }}>
                    <Stack direction="row" spacing={0} alignContent="center" textAlign={'center'} justifyContent={'center'}>
                      {item.length === 0 ? (
                        <AddButton kppn={kppnTab} standardizationId={row.id} month={isEvenPeriod? id + 7 : id + 1} />
                      ) : (
                        <CheckButton file={item[0].file} id={item[0].id} />
                      )}
                    </Stack>
                  </TableCell>
                ))}
              </TableRow>
            );
            break;

          case 2: // 2 mingguan (2x tiap bulan)
            content = (
              <TableRow hover key={row.id} tabIndex={-1}>
                <TableCell align="justify" sx={{ fontSize: '13px' }}>
                  {index + 1}
                </TableCell>
                <TableCell align="left" sx={{ fontSize: '13px' }}>
                  <Typography variant="body2">{row.title}</Typography>
                  <Typography variant="body3">{INTERVAL_DESC[row.interval - 1]}</Typography>
                  <Typography variant="body3" color="primary">{`, Nilai: ${row.score}`}</Typography>
                </TableCell>
                {row.list.map((item, id) => (
                  <TableCell key={id} align="center" sx={{ fontSize: '13px' }}>
                    <Stack direction="row" spacing={0} alignContent="center">
                      {item.length === 0 
                        ? (
                            <>
                              <AddButton kppn={kppnTab} standardizationId={row.id} month={isEvenPeriod? id + 7 : id + 1} />
                              <AddButton kppn={kppnTab} standardizationId={row.id} month={isEvenPeriod? id + 7 : id + 1} />
                            </>
                          )
                        : item.length===1 
                          ? (
                            <>
                              <CheckButton file={item[0].file} id={item[0].id} />
                              <AddButton kppn={kppnTab} standardizationId={row.id} month={isEvenPeriod? id + 7 : id + 1} />
                            </>
                            )
                          :(
                            <>
                              <CheckButton file={item[0].file} id={item[0].id} />
                              <CheckButton file={item[1].file} id={item[1].id} />
                            </>
                            )}
                    </Stack>
                  </TableCell>
                ))}
              </TableRow>
            );
            break;

          case 3: // 1 mingguan (4x tiap bulan)
            content = (
              <TableRow hover key={row.id} tabIndex={-1}>
                <TableCell align="justify" sx={{ fontSize: '13px' }}>
                  {index + 1}
                </TableCell>
                <TableCell align="left" sx={{ fontSize: '13px' }}>
                  <Typography variant="body2">{row.title}</Typography>
                  <Typography variant="body3">{INTERVAL_DESC[row.interval - 1]}</Typography>
                  <Typography variant="body3" color="primary">{`, Nilai: ${row.score}`}</Typography>
                </TableCell>
                {row.list.map((item, id) => {
                    const expectedLength = 4;
                    const short = expectedLength - item.length;
                    return (
                      <TableCell key={id} align="center" sx={{ fontSize: '13px' }}>
                        <Stack direction="row" spacing={0} alignContent="center">
                          <Grid container>
                            {item.map((_, index) => (
                              <Grid item xs={6}>
                                <CheckButton file={item[index].file} id={item[index].id} />
                              </Grid>
                            ))}
                            {Array.from({ length: short }).map((_, index) => (
                              <Grid item xs={6}>
                                <AddButton key={index} kppn={kppnTab} standardizationId={row.id} month={isEvenPeriod? id + 7 : id + 1} />
                              </Grid>
                            ))}
                          </Grid>
                        </Stack>
                      </TableCell>
                    )
                  }
                )}
              </TableRow>
            );
            break;

          case 4: // harian (20 hari tiap bulan)
            content = (
              <TableRow hover key={row.id} tabIndex={-1}>
                <TableCell align="justify" sx={{ fontSize: '13px' }}>
                  {index + 1}
                </TableCell>
                <TableCell align="left" sx={{ fontSize: '13px' }}>
                  <Typography variant="body2">{row.title}</Typography>
                  <Typography variant="body3">{INTERVAL_DESC[row.interval - 1]}</Typography>
                  <Typography variant="body3" color="primary">{`, Nilai: ${row.score}`}</Typography>
                </TableCell>
                {row.list.map((item, id) => (
                  <TableCell key={id} align="center" sx={{ fontSize: '13px' }}>
                    <Stack direction="row" spacing={0} alignContent="center" textAlign={'center'} justifyContent={'center'}>
                      {item.length === 0 ? (
                        <AddButton kppn={kppnTab} standardizationId={row.id} month={isEvenPeriod? id + 7 : id + 1} />
                      ) : (
                        <CheckButton file={item[0].file} id={item[0].id} />
                      )}
                    </Stack>
                  </TableCell>
                ))}
              </TableRow>
            );
          break;

          case 5: // Triwulanan
            content = (
              <TableRow hover key={row.id} tabIndex={-1}>
                <TableCell align="justify" sx={{ fontSize: '13px' }}>
                  {index + 1}
                </TableCell>
                <TableCell align="left" sx={{ fontSize: '13px' }}>
                  <Typography variant="body2">{row.title}</Typography>
                  <Typography variant="body3">{INTERVAL_DESC[row.interval - 1]}</Typography>
                  <Typography variant="body3" color="primary">{`, Nilai: ${row.score}`}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '13px' }} colSpan={3}>
                  <Stack direction="row" spacing={0} alignContent="center" textAlign={'center'} justifyContent={'center'}>
                    {row?.list[2]?.length === 0 ? (
                      <AddButton kppn={kppnTab} standardizationId={row.id} month={isEvenPeriod===0? 3 : 9} />
                    ) : (
                      <CheckButton file={row?.list[2][0]?.file} id={row?.list[2][0]?.id} />
                    )}
                  </Stack>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '13px' }} colSpan={3}>
                  <Stack direction="row" spacing={0} alignContent="center" textAlign={'center'} justifyContent={'center'}>
                    {row?.list[5]?.length === 0 ? (
                      <AddButton kppn={kppnTab} standardizationId={row.id} month={isEvenPeriod===0? 6 : 12} />
                    ) : (
                      <CheckButton file={row?.list[5][0]?.file} id={row?.list[5][0]?.id} />
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            );
          break;

          case 6: // 2 x Tiap Triwulan
            const expectedLength = 2;
            const q1Length = row.list[2].length;
            const q2Length = row.list[5].length;
            const q1Short = expectedLength - q1Length;
            const q2Short = expectedLength - q2Length;
            content = (
              <TableRow hover key={row.id} tabIndex={-1}>
                <TableCell align="justify" sx={{ fontSize: '13px' }}>
                  {index + 1}
                </TableCell>
                <TableCell align="left" sx={{ fontSize: '13px' }}>
                  <Typography variant="body2">{row.title}</Typography>
                  <Typography variant="body3">{INTERVAL_DESC[row.interval - 1]}</Typography>
                  <Typography variant="body3" color="primary">{`, Nilai: ${row.score}`}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '13px' }} colSpan={3}>
                  <Stack direction="row" spacing={0} alignContent="center" textAlign={'center'} justifyContent={'center'}>
                    {
                      Array.from({ length: q1Length }).map((_, index) =>  (
                        <CheckButton file={row.list[2][index].file} id={row.list[2][index].id} />
                      ))
                    }
                    {
                      Array.from({ length: q1Short }).map((_) =>  (
                        <AddButton kppn={kppnTab} standardizationId={row.id} month={isEvenPeriod===0? 3 : 9} />
                      ))
                    }
                  </Stack>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '13px' }} colSpan={3}>
                  <Stack direction="row" spacing={0} alignContent="center" textAlign={'center'} justifyContent={'center'}>
                    {
                      Array.from({ length: q2Length }).map((_, index) =>  (
                        <CheckButton file={row.list[5][index].file} id={row.list[5][index].id} />
                      ))
                    }
                    {
                      Array.from({ length: q2Short }).map((_) =>  (
                        <AddButton kppn={kppnTab} standardizationId={row.id} month={isEvenPeriod===0? 6 : 12} />
                      ))
                    }
                  </Stack>
                </TableCell>
              </TableRow>
            );
          break;

          default:
            content = null;
        }
        
        return content;
      }),
    [standardization]
  );

  return tableRows;
};


export function getAmountShort(standardization: StandardizationType[] | [], isEvenPeriod: number, reportingDate: number) {
  const currentMonth = new Date().getMonth();

  console.log(isEvenPeriod)

  const currMonthSmt = isEvenPeriod===0?currentMonth:(currentMonth-6);

  const currentDate = new Date().getDate();

  const amountShort = standardization && standardization.length>0
    ?standardization.map((item)=> {
          let shortPerItem = 0;
          const start = currentDate<reportingDate ?currMonthSmt-1 : currMonthSmt;
          const end = currentDate<reportingDate ? currMonthSmt : currMonthSmt+1;

          item.short.slice(start, end).map((list) =>
            shortPerItem += list
          );

          return shortPerItem
      })?.reduce((a, c) => a + c)
    :0

  return amountShort
};

export function getReportingMonth(reportingDate: number) {
  const currentDate = new Date().getDate();

  const currentMonth = new Date().getMonth();

  return currentDate<reportingDate?MONTH_NAME[currentMonth-1]:MONTH_NAME[currentMonth]
};

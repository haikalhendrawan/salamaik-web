/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import {Stack, Typography, Table, Card, CardHeader, TableSortLabel,
        TableHead, Grow, TableBody, TableRow, TableCell, Button} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Label from '../../../components/label';
import Iconify from '../../../components/iconify/Iconify';
import ExcelPrintout from './ExcelPrintout';
import { DerivedFindingsType } from '../../../types/findings.type';
// ---------------------------------------------------
const StyledButton = styled(Button)(() => ({
  height: '30px', 
  width: '90px', 
  fontSize:'12px', 
  display: 'inline-flex',   
  alignItems: 'center', 
  justifyContent: 'center', 
  paddingRight: 0,
  paddingLeft: 0,
  borderRadius: '8px'
})) as typeof Button;  

const TABLE_HEAD = [
  { id: 'no', label: 'No', alignRight: false },
  { id: 'komponen', label: 'Komponen', alignRight: false },
  { id: 'checklist', label: 'Checklist', alignRight: false },
  { id: 'finding', label: 'Permasalahan', alignRight: false },
  { id: 'status', label: 'Status*', alignRight: false },
  { id: 'pic', label: 'PIC', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

interface FollowUpTableProps{
  findings: DerivedFindingsType[] | null,
  kppnId: string | null,
  isFinal: boolean | null,
  nonFinalFindings: DerivedFindingsType[] | null,
}

// ----------------------------------------------------------------------------------
export default function FollowUpTable({findings, kppnId, isFinal, nonFinalFindings}: FollowUpTableProps) {
  const theme = useTheme();

  const [showFinal, setShowFinal] = useState<boolean>(isFinal || false);

  const handleChangeFinal = (final: boolean) => {
    if(isFinal){
      setShowFinal(final);
    }
  };

  const allowFinalState = isFinal && showFinal;

  const sourceFindings = allowFinalState ? findings : nonFinalFindings;
  const isRegulation2 = Boolean(sourceFindings?.some((item) => item.worksheet_type));
  const worksheetOrder: Record<string, number> = { PB: 0, SPML: 1, CK: 2 };
  const findingsToShow = isRegulation2
    ? [...(sourceFindings || [])].sort((a, b) =>
        (worksheetOrder[a.worksheet_type || ''] ?? 3) - (worksheetOrder[b.worksheet_type || ''] ?? 3) || a.id - b.id)
    : sourceFindings;

  return (
    <>
      <Grow in>
        <Card sx={{height:'auto', display:'flex', flexDirection:'column', gap:theme.spacing(1), mb: 1}}>
          <CardHeader 
            title={
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
              <Typography variant='h6'>Rekapitulasi Permasalahan</Typography>
              <ExcelPrintout kppnId={kppnId || ''}/>
            </Stack>
            } 
            sx={{mb:2}}
          />

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
              {findingsToShow?.map((item, index) => {
                const firstInWorksheetGroup = isRegulation2 && (index === 0 || findingsToShow[index - 1].worksheet_type !== item.worksheet_type);
                const worksheetChecklist = item.checklist as unknown as { materi?: string; uraian?: string; title?: string };
                const checklistTitle = item.worksheet_type === 'CK'
                  ? worksheetChecklist?.materi || item.checklist?.title
                  : item.worksheet_type === 'SPML'
                    ? worksheetChecklist?.uraian || item.checklist?.title
                    : item.checklist?.title;
                return (
                  <Fragment key={item.id}>
                    {firstInWorksheetGroup && (
                      <TableRow>
                        <TableCell
                          colSpan={TABLE_HEAD.length}
                          sx={{ fontSize: 13, fontWeight: 700, bgcolor: 'action.hover', color: 'text.primary' }}
                        >
                          Kertas Kerja {item.worksheet_type}
                        </TableCell>
                      </TableRow>
                    )}
                <TableRow hover key={item.id} tabIndex={-1}>
                  <TableCell align="justify" sx={{fontSize: '13px'}}>{index+1}</TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    {isRegulation2 ? (
                      <>
                        <Typography variant='body2' fontWeight={'bold'} fontSize={'13px'}>{item.komponen?.title}</Typography>
                        {item.worksheet_type === 'PB' && <Typography variant='body2' fontSize={'13px'}>{item.subkomponen?.title}</Typography>}
                      </>
                    ) : (
                      <>
                        <Typography variant='body2' fontWeight={'bold'} fontSize={'13px'}>Komponen {item.komponen.title}</Typography>
                        <Typography variant='body2' fontSize={'13px'}>Subkomponen {item.subkomponen.title}</Typography>
                      </>
                    )}
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    {checklistTitle}
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>{item.matrix.permasalahan}</TableCell>

                  <TableCell align="left">
                    {item.status===0
                      ? <Label color={'error'}> Belum </Label>
                      : item.status===1
                        ? <Label color={'warning'}> Proses </Label>
                        : item.status===2
                          ? <Label color={'error'}> Ditolak </Label>
                          : <Label color={'success'}> Disetujui </Label>
                    }
                  </TableCell>

                  <TableCell align="left" sx={{fontSize: '13px'}}>
                    {item.matrix.uic}
                  </TableCell> 

                  <TableCell align="left">
                    <Stack>
                      <StyledButton
                        endIcon={<Iconify icon="eva:arrow-ios-forward-outline" />} 
                        variant="contained" 
                        color="warning"
                        component={Link}  
                        to={`/followUp/detail?id=${kppnId}&findingsId=${item.id}&index=${index+1}`}
                      >
                        Follow Up
                      </StyledButton>
                    </Stack>
                  </TableCell> 
                </TableRow>
                  </Fragment>
              )})}

            </TableBody>
          </Table>
        </Card>
      </Grow>

      {
        isFinal ? showFinal 
          ? (
              <Button 
                variant='contained' 
                endIcon={<Iconify icon="solar:eye-bold-duotone" />} 
                sx={{mt: 2}}
                onClick={() => handleChangeFinal(false)}
              >
                Lihat Permasalahan Non Final
              </Button>
            )
          : (
              <Button 
                variant='contained' 
                endIcon={<Iconify icon="solar:eye-closed-bold-duotone" />} 
                sx={{mt: 2}}
                onClick={() => handleChangeFinal(true)}
              >
                Sembunyikan Permasalahan Non Final
              </Button>
            )
        : null
      }

      <Grow in>
        <Stack direction='column' spacing={1} sx={{pl: 2, pt:2}}>
          <Typography variant='body2' fontWeight='bold' sx={{fontSize: '12px'}}>*Status:</Typography>
          <Typography variant='body2' sx={{fontSize: '12px'}}>1. Belum: belum ditindaklanjuti KPPN </Typography>
          <Typography variant='body2' sx={{fontSize: '12px'}}>2. Proses: sudah ditindaklanjuti & proses verifikasi Kanwil </Typography>
          <Typography variant='body2' sx={{fontSize: '12px'}}>3. Ditolak: tindak lanjut ditolak Kanwil </Typography>
          <Typography variant='body2' sx={{fontSize: '12px'}}>4. Disetujui: tindak lanjut disetujui Kanwil </Typography>
        </Stack>
      </Grow>
    </>
  )
}

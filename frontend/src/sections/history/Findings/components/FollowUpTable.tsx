/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { Link } from 'react-router-dom';
import {Stack, Typography, Table, Card, CardHeader, TableSortLabel,
        TableHead, Grow, TableBody, TableRow, TableCell, Button} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify/Iconify';
import { MatrixWithWsJunctionType } from '../../../matrix/types';
import { FindingsResponseType } from '../../../followUp/types';
// ---------------------------------------------------
const StyledButton = styled(Button)(({  }) => ({
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
  { id: 'checklist', label: 'Checklist', alignRight: false },
  { id: 'finding', label: 'Permasalahan', alignRight: false },
  { id: 'status', label: 'Status*', alignRight: false },
  { id: 'pic', label: 'PIC', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

interface FollowUpTableProps{
  findings: FindingsResponseType[] | [],
  kppnId: string | null
}

// ----------------------------------------------------------------------------------
export default function FollowUpTable({findings, kppnId}: FollowUpTableProps) {
  const theme = useTheme();

  const refKomponen = Array(...new Set(findings.map((item) => item.matrixDetail[0].komponen_string)));

  const refSubKomponen =  refKomponen.map((k) => {
    const findingsByKomponen = findings.filter(f => f.matrixDetail[0].komponen_string === k);
    const subkomponen = Array(...new Set(findingsByKomponen.map((item) => item.matrixDetail[0].subkomponen_string)));

    return ({
      komponen: k,
      subkomponen: subkomponen
    }
    )
  })

  return (
    <>
      <Grow in>
      <Card sx={{height:'auto', display:'flex', flexDirection:'column', gap:theme.spacing(1), mb: 1}}>
        <CardHeader title={<Typography variant='h6'>Rekapitulasi Permasalahan</Typography>} sx={{mb:2}}/>

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
            {/* {findings.map((item, index) => 
              <TableRow hover key={item.id} tabIndex={-1}>
                <TableCell align="justify" sx={{fontSize: '13px'}}>{index+1}</TableCell>

                <TableCell align="left" sx={{fontSize: '13px'}}>
                  <Typography variant='body2' fontWeight={'bold'} fontSize={'13px'}>Komponen {item.matrixDetail[0]?.komponen_string}</Typography>
                  <Typography variant='body2' fontSize={'13px'}>Subkomponen {item.matrixDetail[0]?.subkomponen_string}</Typography>
                </TableCell>

                <TableCell align="left" sx={{fontSize: '13px'}}>
                  {item.matrixDetail[0].checklist[0].matrix_title}
                </TableCell>

                <TableCell align="left" sx={{fontSize: '13px'}}>{item.matrixDetail[0].permasalahan}</TableCell>

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
                  {item.matrixDetail[0].uic}
                </TableCell> 

                <TableCell align="left">
                  <Stack>
                    <StyledButton
                      endIcon={<Iconify icon="eva:arrow-ios-forward-outline" />} 
                      variant="contained" 
                      color="warning"
                      component={Link}  
                      to={`/followUp/detail?id=${kppnId}&findingsId=${item.id}`}
                    >
                      Follow Up
                    </StyledButton>
                  </Stack>
                </TableCell> 
              </TableRow>
            )} */}
            {
              refSubKomponen.map((item, index) => 
                (
                  <>
                    <TableRow hover key={index} tabIndex={-1}>
                      <TableCell align="justify" colSpan={TABLE_HEAD.length}>
                        <Typography fontWeight={'bold'} fontSize={'0.9rem'}>
                          Komponen {item.komponen}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {
                        findings.filter(f => f.matrixDetail[0].komponen_string === item.komponen).map((item, index) => 
                          <>
                            <TableRow hover key={item.id} tabIndex={-1}>
                              <TableCell align="justify" sx={{fontSize: '13px'}}>{index+1}</TableCell>

                              <TableCell align="left" sx={{fontSize: '13px'}}>
                                {item.matrixDetail[0].checklist[0].matrix_title}
                              </TableCell>

                              <TableCell align="left" sx={{fontSize: '13px'}}>
                                {item.matrixDetail[0].checklist[0].matrix_title}
                              </TableCell>

                              <TableCell align="left" sx={{fontSize: '13px'}}>{item.matrixDetail[0].permasalahan}</TableCell>

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
                                {item.matrixDetail[0].uic}
                              </TableCell> 
                              
                            </TableRow>
                          </>  
                        )
                    }
                  </>

                                      
                )
              )
            }

          </TableBody>
        </Table>
      </Card>
      </Grow>

      <Grow in>
        <Stack direction='column' spacing={1} sx={{pl: 2}}>
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
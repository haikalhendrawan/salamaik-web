import {useState, useEffect, useRef} from'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {Stack, Table, Card, TableSortLabel,Tooltip, TableHead, Grow, TableBody, 
  TableRow, TableCell} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import Label from '../../../../components/label';
import StyledButton from '../../../../components/styledButton/StyledButton';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useLoading from '../../../../hooks/display/useLoading';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useBatch from './useBatch';
import useDialog from '../../../../hooks/display/useDialog';
//----------------------------------------------------
const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'kppn', label: 'KPPN', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'Open Period', label: 'Open Period', alignRight: false },
  { id: 'Close Period', label: 'Close Period', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

interface BatchData{
  id: string, 
  kppn_id: string,
  name: string, 
  alias: string,
  period: number,
  status: number,
  open_period: string,
  close_period: string,
  created_at: string,
  updated_at: string
};

interface BatchRefTableProps {
  tableData: BatchData[],
  handleOpen: (id: string) => void
};

export default function BatchRefTable({tableData, handleOpen}: BatchRefTableProps) {
  const theme = useTheme();

  const {openSnackbar} = useSnackbar();

  const {setIsLoading} = useLoading();

  const axiosJWT = useAxiosJWT();

  const {getBatch} = useBatch();

  const {openDialog} = useDialog();

  const handleDelete = async(id: string) => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.post(`/deleteWorksheet`, {worksheetId: id});
      openSnackbar(response.data.message, "success");
      getBatch();
      setIsLoading(false);
    }catch(err: any){
      if(err.response){
        openSnackbar(err.response.data.message, "error");
        setIsLoading(false);
      }else{
        openSnackbar("Network Error", "error");
        setIsLoading(false);
      }
    }
  };

  const handleOpenDelete = (id: string) => {
    openDialog(
      "Delete",
      "Yakin hapus kertas kerja ini? seluruh input dan bukti dukung yang diisi oleh KPPN akan terhapus",
      'pink',
      'Delete',
      () => handleDelete(id)
    )
  };

  const handleAssign = async(id: string, kppnId: string, period: number) => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.post(`/assignWorksheet`, {worksheetId: id, kppnId, period});
      openSnackbar(response.data.message, "success");
      getBatch();
      setIsLoading(false);
    }catch(err: any){
      if(err.response){
        openSnackbar(err.response.data.message, "error");
        setIsLoading(false);
      }else{
        openSnackbar("Network Error", "error");
        setIsLoading(false);
      }
    }
  };

  const handleOpenAssign= (id: string, kppnId: string, period: number) => {
    openDialog(
      "Assign Kertas Kerja",
      "Yakin assign kertas kerja? pastikan kembali seluruh referensi checklist telah diinput",
      'success',
      'assign',
      () => handleAssign(id, kppnId, period)
    )
  };

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
                  >
                    <TableSortLabel
                      hideSortIcon
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((row, index) => 
                <TableRow hover key={row.id} tabIndex={-1}>
                  <TableCell align="justify">{index+1}</TableCell>

                  <TableCell align="left">{row.alias}</TableCell>

                  <TableCell align="left">
                    <Label color={row.status===1?'success':'pink'}>
                      {row.status===1?'Assigned':'Unassigned'}
                    </Label>
                  </TableCell>

                  <TableCell align="left">
                    {format(new Date(row.open_period), 'd MMMM yyy', {locale: id})}
                  </TableCell>

                  <TableCell align="left">
                    {format(new Date(row.close_period), 'd MMMM yyy', {locale: id})}
                  </TableCell>

                  <TableCell align="justify">
                    <Stack direction='row' spacing={1}>
                      <Tooltip title='assign'>
                        <span>
                          <StyledButton
                            sx={{display: row.status===1?'none':'flex'}} 
                            aria-label="assign" 
                            variant='contained' 
                            size='small' 
                            color='success'
                            onClick={() => handleOpenAssign(row.id, row.kppn_id, row.period)}
                          >
                            <Iconify icon="solar:plain-bold"/>
                          </StyledButton>
                        </span>
                      </Tooltip>
                      <Tooltip title='edit'>
                        <span>
                          <StyledButton 
                            aria-label="edit" 
                            variant='contained' 
                            size='small' 
                            color='warning'
                            onClick={() => handleOpen(row.id)}
                          >
                            <Iconify icon="solar:pen-bold-duotone"/>
                          </StyledButton>
                        </span>
                      </Tooltip>
                      <Tooltip title='delete'>
                        <span>
                          <StyledButton 
                            aria-label="delete" 
                            variant='contained' 
                            size='small' 
                            color='pink'
                            onClick={() => handleOpenDelete(row.id)}
                          >
                            <Iconify icon="solar:trash-bin-trash-bold"/>
                          </StyledButton>
                        </span>
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
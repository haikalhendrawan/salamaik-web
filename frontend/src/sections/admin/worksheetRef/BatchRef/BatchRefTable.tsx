import {useState, useEffect, useRef} from'react';
import {Stack, Button, Box, Typography, Table, Card, Modal, FormControl, Paper, InputLabel, TableSortLabel,
  Tooltip, TableHead, Grow, TableBody, TableRow, TableCell, Select, MenuItem} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import Label from '../../../../components/label';
import Scrollbar from '../../../../components/scrollbar';
import StyledTextField from '../../../../components/styledTextField/StyledTextField';
import StyledButton from '../../../../components/styledButton/StyledButton';
//----------------------------------------------------
const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'periodName', label: 'Nama Periode', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'Open Period', label: 'Open Period', alignRight: false },
  { id: 'Close Period', label: 'Close Period', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

interface BatchData{
  id: number,
  periodID: number,
  kppnID: number,
  kppnName: string,
  batchStatus: number,
  openPeriod: string,
  closePeriod: string
};

interface BatchRefTableProps {
  tableData: BatchData[],
  handleOpen: (id: number) => void
};

export default function BatchRefTable({tableData, handleOpen}: BatchRefTableProps) {
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
              {tableData.map((row) => 
                <TableRow hover key={row.id} tabIndex={-1}>
                  <TableCell align="justify">{row.id}</TableCell>

                  <TableCell align="left">{row.kppnName}</TableCell>

                  <TableCell align="left">
                    <Label color={row.batchStatus===1?'success':'pink'}>
                      {row.batchStatus===1?'Assigned':'Unassigned'}
                    </Label>
                  </TableCell>

                  <TableCell align="left">
                    {row.openPeriod}
                  </TableCell>

                  <TableCell align="left">
                    {row.closePeriod}
                  </TableCell>

                  <TableCell align="justify">
                    <Stack direction='row' spacing={1}>
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
                          <StyledButton aria-label="delete" disabled variant='contained' size='small' color='white'>
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
import {useState, useEffect, useRef} from'react';
import {Stack, Button, Box, Typography, Table, Card, Modal, FormControl, Paper, InputLabel, TableSortLabel,
  Tooltip, TableHead, Grow, TableBody, TableRow, TableCell, Select, MenuItem} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import StyledButton from '../../../../components/styledButton/StyledButton';
//----------------------------------------------------
const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'periodName', label: 'Nama Periode', alignRight: false },
  { id: 'startDate', label: 'Start Date', alignRight: false },
  { id: 'endDate', label: 'End Date', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

interface PeriodType{
  id: number;
  name: string; 
  evenPeriod: 0;
  semester: number;
  tahun: string
};

interface PeriodRefTableProps {
  tableData: PeriodType[] | null,
  handleOpen: (id: number) => void
};

export default function PeriodRefTable({tableData, handleOpen}: PeriodRefTableProps) {
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
              {tableData?.map((row) => 
                <TableRow hover key={row.id} tabIndex={-1}>
                  <TableCell align="justify">{row.id+1}</TableCell>

                  <TableCell align="left">{row.name}</TableCell>

                  <TableCell align="left">
                    {row.evenPeriod===0?`01 Jan ${row.tahun}`:`01 Jul ${row.tahun}`}
                  </TableCell>

                  <TableCell align="left">{row.evenPeriod===0?`30 Jun ${row.tahun}`: `31 Dec ${row.tahun}`}</TableCell>

                  <TableCell align="justify">
                    <Stack direction='row' spacing={1}>
                      <Tooltip title='edit'>
                        <span>
                          <StyledButton 
                            aria-label="edit" 
                            variant='contained' 
                            size='small' 
                            color='warning'
                            disabled
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
                            disabled 
                            variant='contained' 
                            size='small' 
                            color='white'
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
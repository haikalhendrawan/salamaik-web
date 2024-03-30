import { useState } from 'react';
// @mui
import {Card, Table, Stack, Paper, Avatar, Button, ListItemText, TableRow, Tooltip, TableBody, TableCell,
    Container, Typography, IconButton, TableContainer, TablePagination, styled, List} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// hooks
import useAxiosJWT from "../../../hooks/useAxiosJWT";
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
// sections
import UserRefTableHead from './UserRefTableHead';
import UserRefTableToolbar from './UserRefTableToolbar';
//utils
import {descendingComparator, getComparator, applySortFilter} from './utils';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nama', alignRight: false },
  { id: 'company', label: 'Unit', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'isVerified', label: 'Role', alignRight: false },
  { id: 'role', label: 'Action', alignRight: false },
];


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

// ----------------------------------------------------------------------
interface UserRefTableProps{
users: any[]
}

export default function UserRefTable({users}: UserRefTableProps) {
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);

  const [page, setPage] = useState<number>(0);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [orderBy, setOrderBy] = useState<string>('name');

  const [filterName, setFilterName] = useState<string>('');

  const [rowsPerPage, setRowsPerPage] = useState<number>(25);

  const [filterStatus, setFilterStatus] = useState<number | "" | undefined>(0);

  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event: SelectChangeEvent<number>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterStatus = (event: SelectChangeEvent<number>) => {
    event.stopPropagation();
    setFilterStatus(event.target.value as number);
  }

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const filteredUsers= applySortFilter(users, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;
  
  return (
    <>

        <Card>
          <UserRefTableToolbar 
            filterName={filterName} 
            onFilterName={handleFilterByName} 
            filterStatus = {filterStatus}
            onFilterStatus={handleFilterStatus} 
            />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserRefTableHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                    const {id, avatarUrl, name, company, isVerified, status, role} = row;
                    return (
                      <TableRow hover key={index} tabIndex={-1}>
                         <TableCell component="th" scope="row" >
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={name} src={avatarUrl} />
                              <List disablePadding dense>
                                <ListItemText>
                                  <Typography variant="body2" noWrap>Muhammad Haikal Putra H</Typography>
                                  <Typography variant="body3" noWrap>haikal.hendrawan@kemenkeu.go.id</Typography>
                                </ListItemText>
                              </List>
                            </Stack>
                          </TableCell>

                        <TableCell align="left">{company}</TableCell>

                        <TableCell align="left">
                          <Label 
                            color={status==='active'?'success':'error'} 
                            sx={{cursor:'pointer'}}
                          >
                            {status}
                          </Label>
                        </TableCell>

                        <TableCell align="justify">{ role }</TableCell>

                        <TableCell align="justify">
                          <Stack direction='row' spacing={1}>
                            <Tooltip title='approve'>
                              <StyledButton aria-label="approve" variant='contained' size='small' color='success'>
                                <Iconify icon="solar:check-circle-bold-duotone"/>
                              </StyledButton>
                            </Tooltip>
                            <Tooltip title='edit'>
                              <StyledButton aria-label="edit" variant='contained' size='small' color='warning'>
                                <Iconify icon="solar:pen-bold-duotone"/>
                              </StyledButton>
                            </Tooltip>
                            <Tooltip title='delete'>
                              <StyledButton aria-label="delete" variant='contained' size='small' color='white'>
                                <Iconify icon="solar:trash-bin-trash-bold"/>
                              </StyledButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>

                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>



    </>
  );
}
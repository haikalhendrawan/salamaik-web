import { useState } from 'react';
// @mui
import {Card, Table, Stack, Paper, Avatar, Button, ListItemText, TableRow, Tooltip, TableBody, TableCell,
    Container, Typography, IconButton, TableContainer, TablePagination, styled, List, Grow} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// hooks
import useAxiosJWT from "../../../hooks/useAxiosJWT";
import useUser from './useUser';
import useDictionary from '../../../hooks/useDictionary';
import useLoading from '../../../hooks/display/useLoading';
import useSnackbar from '../../../hooks/display/useSnackbar';
import useDialog from '../../../hooks/display/useDialog';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
// sections
import UserRefTableHead from './UserRefTableHead';
import UserRefTableToolbar from './UserRefTableToolbar';
//utils
import {descendingComparator, getComparator, applySortFilter, StyledButton} from './utils';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Nama', alignRight: false },
  { id: 'kppn', label: 'Unit', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];
// ----------------------------------------------------------------------
interface UserRefTableProps{
  users: any[],
  setEditModalOpen: (id: string) => void,
  tab: 0 | 1 | 2,
  setTab: React.Dispatch<React.SetStateAction<0 | 1 | 2>>
};

export default function UserRefTable({users, setEditModalOpen, tab, setTab}: UserRefTableProps) {
  const [page, setPage] = useState<number>(0);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [orderBy, setOrderBy] = useState<string>('name');

  const [filterName, setFilterName] = useState<string>('');

  const [filterUnit, setFilterUnit]= useState<string>('');

  const [rowsPerPage, setRowsPerPage] = useState<number>(25);

  const {getUser} = useUser();

  const { statusRef, roleRef, kppnRef, periodRef } = useDictionary();

  const {setIsLoading} = useLoading();

  const {openSnackbar} = useSnackbar();

  const {openDialog} = useDialog();
  
  const axiosJWT = useAxiosJWT();

  const handleDelete = async(id: number) => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.post("/deleteUser", {id: id});
      openSnackbar(response.data.message, 'success');
      getUser();
      setIsLoading(false);
    }catch(err: any){
      openSnackbar(err.response.data.message, 'success');
      setIsLoading(false);
    }finally{
      setIsLoading(false);
    }
  };

  const handleOpenDelete = (id: number) => {
    openDialog(
      "Delete",
      "Are you sure you want to delete this user?",
      'pink',
      'Delete',
      () => handleDelete(id)
    )
  };

  const handleApprove = async(id: number) => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.post("/updateStatus", {id: id});
      openSnackbar(response.data.message, 'success');
      getUser();
      setIsLoading(false);
    }catch(err: any){
      openSnackbar(err.response.data.message, 'success');
      setIsLoading(false);
    }finally{
      setIsLoading(false);
    }
  };

  const handleOpenEdit = (id: string) => {
    setEditModalOpen(id)
  };

  const handleRequestSort = (event: SelectChangeEvent<number>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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

  const handleFilterUnit = (event: SelectChangeEvent<unknown>) => {
    setPage(0);
    setFilterUnit(event.target.value as string);
    console.log(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const filteredUsers= applySortFilter(users, getComparator(order, orderBy), filterName, tab, filterUnit);

  const isNotFound = !filteredUsers.length && !!filterName;
  
  return (
    <>
    <Grow in>
        <Card>
          <UserRefTableToolbar 
            filterName={filterName} 
            handleFilterName={handleFilterByName}
            filterUnit={filterUnit}
            handleFilterUnit={handleFilterUnit} 
            tab={tab}
            setTab={setTab} 
            users={users}
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
                    return (
                      <TableRow hover key={index} tabIndex={-1}>
                         <TableCell component="th" scope="row" >
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={row.id} src={`${import.meta.env.VITE_API_URL}/avatar/${row.picture}?${new Date().getTime()}`} />
                              <List disablePadding dense>
                                <ListItemText>
                                  <Typography variant="body2" noWrap>{row.name}</Typography>
                                  <Typography variant="body3" noWrap>{row.email}</Typography>
                                </ListItemText>
                              </List>
                            </Stack>
                          </TableCell>

                        <TableCell align="left">{kppnRef?kppnRef[row.kppn]:null}</TableCell>

                        <TableCell align="left">
                          <Label 
                            color={row.status===1?'success':'error'} 
                            sx={{cursor:'pointer'}}
                          >
                            {statusRef?statusRef[row.status]:null}
                          </Label>
                        </TableCell>

                        <TableCell align="justify">{roleRef?roleRef[row.role]:null}</TableCell>

                        <TableCell align="justify">
                          <Stack direction='row' spacing={1}>
                            {row.status===0
                            ? <Tooltip title='approve'>
                                <StyledButton 
                                  aria-label="approve" 
                                  variant='contained' 
                                  size='small' 
                                  color='success'
                                  onClick={() => handleApprove(row.id)}
                                >
                                  <Iconify icon="solar:check-circle-bold-duotone"/>
                                </StyledButton>
                              </Tooltip>
                            : null
                            }
                            <Tooltip title='edit'>
                              <StyledButton 
                                aria-label="edit" 
                                variant='contained' 
                                size='small' 
                                color='warning'
                                onClick={() => handleOpenEdit(row.id)}
                                >
                                <Iconify icon="solar:pen-bold-duotone"/>
                              </StyledButton>
                            </Tooltip>
                            <Tooltip title='delete'>
                              <StyledButton 
                                aria-label="delete" 
                                variant='contained' 
                                size='small' 
                                color='white'
                                onClick={() => handleOpenDelete(row.id)}
                              >
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

      </Grow>



    </>
  );
}
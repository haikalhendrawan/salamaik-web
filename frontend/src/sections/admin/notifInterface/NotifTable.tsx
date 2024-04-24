import {useState, useEffect} from'react';
import {Stack, Table, Card, TablePagination, TableSortLabel,
          Tooltip, TableHead, Grow, TableBody, TableRow, TableCell} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import Label from '../../../components/label/Label';
import StyledButton from '../../../components/styledButton/StyledButton';
import Iconify from '../../../components/iconify/Iconify';
// ---------------------------------------------------
const TABLE_HEAD = [
  { id: 'no', label: 'No', alignRight: false },
  { id: 'title', label: 'Judul', alignRight: false },
  { id: 'message', label: 'Pesan', alignRight: false },
  { id: 'created_at', label: 'Date Created', alignRight: false },
  { id: 'published', label: 'Status', alignRight: false },
  { id: 'action', label: 'Action', alignRight: false },
];

interface Notif{
  id: number,
  title: string | null,
  message: string | null,
  created_by: string | null,
  categories: number | null,
  published: number | null, 
  created_at: string,
};

interface NotifTableProps{
  notifications: Notif[],
  assignNotif: (notifID: number) => void,
  deleteNotif: (notifID: number) => void,
}

// ----------------------------------------------------------------------------------

export default function NotifTable({notifications, assignNotif, deleteNotif}:NotifTableProps){
  const theme = useTheme();

  const [page, setPage] = useState<number>(0);

  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  return(
    <>
    <Card sx={{minHeight:480, display:'flex', flexDirection:'column', gap:theme.spacing(1)}}>
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
          {notifications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => 
            <TableRow hover key={index} tabIndex={-1}>
              <TableCell align="justify">{index+1}</TableCell>

              <TableCell align="left">{row.title}</TableCell>

              <TableCell align="left">{row.message}</TableCell>
              
              <TableCell align="left">{new Date(row.created_at).toLocaleDateString('id-ID')}</TableCell>

              <TableCell align="left">
                {row.published===0
                ?<Label color='error'>Unpublished</Label>
                : <Label color='success'>Published</Label>}
              </TableCell>

              <TableCell align="justify">
                <Stack direction='row' spacing={1}>
                  <Tooltip title='Publish'>
                    <span>
                      <StyledButton 
                        disabled={row.published===1}
                        aria-label="edit" 
                        variant='contained' 
                        size='small' 
                        color='success'
                        onClick={() => assignNotif(row.id)}
                      >
                        <Iconify icon="solar:plain-bold"/>
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
                        onClick={() => deleteNotif(row.id)}
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

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={notifications.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
    </>
  )
  
}
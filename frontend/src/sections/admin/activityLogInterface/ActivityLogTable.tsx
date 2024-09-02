import {useState} from'react';
import {Table, Card, TablePagination, TableSortLabel, TableHead, TableBody, TableRow, TableCell} from '@mui/material';
import { useTheme,} from '@mui/material/styles';
import { ActivityLogType } from '../../../pages/admin/ActivityLogPage';
import ActivityLogTableToolbar from './ActivityLogTableToolbar';
import { SelectChangeEvent } from '@mui/material/Select';
// ---------------------------------------------------
const TABLE_HEAD = [
  { id: 'no', label: 'No', alignRight: false },
  { id: 'user', label: 'Nama/NIP', alignRight: false },
  { id: 'activity', label: 'Aktivitas', alignRight: false },
  { id: 'timestamp', label: 'Time Stamp', alignRight: false },
];

interface activityTableProps{
  activity: ActivityLogType[],
};
// ----------------------------------------------------------------------------------

export default function ActivityLogTable({activity}:activityTableProps){
  const theme = useTheme();

  const [page, setPage] = useState<number>(0);

  const [rowsPerPage, setRowsPerPage] = useState<number>(50);

  const [filterCluster, setFilterCluster] = useState<number | null>(null);

  const [filterUser, setFilterUser] = useState<string | null>(null);

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleChangeFilterUser = (event: SelectChangeEvent) => {
    setPage(0);
    if(event.target.value === ""){
      return setFilterUser(null)
    };
    setFilterUser(event.target.value as string);
  };

  const handleChangeFilterCluster = (event: SelectChangeEvent) => {
    setPage(0);
    if(event.target.value === ""){
      return setFilterCluster(null)
    };
    setFilterCluster(parseInt(event.target.value as string));
  };

  const filteredActivity = activity
  ?.filter((item) => {
    const userMatch = filterUser ? item.user_id===filterUser : true;
    const clusterMatch = filterCluster ? item.cluster.toString()[0]===filterCluster.toString() : true;
    return userMatch && clusterMatch
   })
  .filter((item) => item.cluster%10===2)

  return(
    <>
    <Card sx={{minHeight:480, display:'flex', flexDirection:'column', gap:theme.spacing(1)}}>
      <ActivityLogTableToolbar filterUser={handleChangeFilterUser} filterCluster={handleChangeFilterCluster} />
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
          {filteredActivity.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)?.map((row, index) => 
            <TableRow hover key={index} tabIndex={-1}>
              <TableCell align="justify">{index+1}</TableCell>

              <TableCell align="left">{row.user_name} <br/> {row.user_id}</TableCell>

              <TableCell align="left">{row.description}</TableCell>
              
              <TableCell align="left">{new Date(row.timestamp).toLocaleString('en-GB')}</TableCell>

            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[50, 100, 250]}
        component="div"
        count={filteredActivity.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
    </>
  )
}
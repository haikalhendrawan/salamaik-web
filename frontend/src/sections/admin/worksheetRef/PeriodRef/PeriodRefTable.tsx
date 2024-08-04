import {Stack, Table, Card,  TableSortLabel, Tooltip, TableHead, Grow, TableBody, TableRow, TableCell} from '@mui/material';
import { useTheme} from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import StyledButton from '../../../../components/styledButton/StyledButton';
import useLoading from '../../../../hooks/display/useLoading';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useDictionary from '../../../../hooks/useDictionary';
import useDialog from '../../../../hooks/display/useDialog';
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
  tahun: number
};

interface PeriodRefTableProps {
  tableData: PeriodType[] | null,
  handleOpen: (id: number) => void
};

export default function PeriodRefTable({tableData}: PeriodRefTableProps) {
  const theme = useTheme();

  const axiosJWT = useAxiosJWT();

  const {openSnackbar} = useSnackbar();

  const {setIsLoading} = useLoading();

  const {getDictionary} = useDictionary();

  const {openDialog} = useDialog();

  const handleOpenDelete = (id: number) => {
    openDialog(
      "Delete",
      "Yakin hapus periode ini? seluruh kertas kerja periode berkenaan akan terhapus",
      'pink',
      'Delete',
      () => handleDelete(id)
    )
  };

  const handleDelete = async(id: number) => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.post("/deletePeriodById", {periodId: id});
      openSnackbar(response.data.message, "success");
      getDictionary();
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
  }

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
              {tableData?.sort((a, b) => a.tahun - b.tahun || a.semester - b.semester).map((row, index) => 
                <TableRow hover key={row.id} tabIndex={-1}>
                  <TableCell align="justify">{index+1}</TableCell>

                  <TableCell align="left">{row.name}</TableCell>

                  <TableCell align="left">
                    {row.evenPeriod===0?`01 Jan ${row.tahun}`:`01 Jul ${row.tahun}`}
                  </TableCell>

                  <TableCell align="left">{row.evenPeriod===0?`30 Jun ${row.tahun}`: `31 Dec ${row.tahun}`}</TableCell>

                  <TableCell align="justify">
                    <Stack direction='row' spacing={1}>
                      {/* <Tooltip title='edit'>
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
                      </Tooltip> */}
                      <Tooltip title='delete'>
                        <span>
                          <StyledButton 
                            aria-label="delete" 
                            variant='contained' 
                            size='small' 
                            color='white'
                            onClick= {() => handleOpenDelete(row.id)}
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
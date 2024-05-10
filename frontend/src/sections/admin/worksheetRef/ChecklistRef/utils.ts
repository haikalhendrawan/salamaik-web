import { styled } from '@mui/material/styles';

interface ChecklistType{
  id: number,
  title: string, 
  header: string | null,
  komponen_id: number,
  subkomponen_id: number | null,
  subsubkomponen_id: number | number,
  standardisasi: number | null, 
  matrix_title: string | null, 
  file1: string | null,
  file2: string | null,
  opsi: OpsiType[] | null
};

interface OpsiType{
  id: number,
  title: string, 
  value: number,
  checklist_id: number
};

export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export function descendingComparator(a: any, b: any, orderBy: string) {
  if (a[orderBy] === null) {
    return 1;
  }
  if (b[orderBy] === null) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

export function applySortFilter(array: any[], comparator: any, tab: number): ChecklistType[] {
  const filteredData = array.filter((item) => {
    const komponenMatches = item.komponen_id===tab || tab===null || tab===0;

    return komponenMatches
  });

  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => comparator(a[0], b[0]));

  console.log(stabilizedThis.sort((a, b) => comparator(a[0], b[0])).filter((el) => filteredData.includes(el[0])))

  return stabilizedThis
    .filter((el) => filteredData.includes(el[0]))
    .map((el) => el[0]);
} 



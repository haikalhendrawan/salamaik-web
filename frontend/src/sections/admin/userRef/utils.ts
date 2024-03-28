export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};


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

export function applySortFilter(array: any[], comparator: any, query: string) {

  // const filteredData = array.filter((item) => {
  //   const date = new Date(Date.parse(item.date));
  //   const yearMatches = !tahun || date.getFullYear() === tahun;
  //   const queryMatches =
  //     !query ||
  //     Object.values(item).some(
  //       (value) => typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase())
  //     );
  //   const statusMatches = status===null || item.status === status;

  //   return yearMatches && monthMatches && queryMatches && statusMatches;
  // });
  const filteredData = array;
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => comparator(a[0], b[0]));

  return stabilizedThis
    .filter((el) => filteredData.includes(el[0]))
    .map((el) => el[0]);
} 

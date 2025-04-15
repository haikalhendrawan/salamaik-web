import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

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


export const StyledButton = styled(Button)(({  }) => ({
  display: 'inline-flex',   
  alignItems: 'center', 
  justifyContent: 'center', 
  paddingRight: 0,
  paddingLeft: 0,
  minHeight: '30px',
  minWidth: '30px',
  borderRadius: '12px',
}));  


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

export function applySortFilter(array: any[], comparator: any, query: string, status: number, unit: string) {
  const filteredData = array.filter((item) => {
    const statusMatches = item.status===status || status===null || status===2;
    const unitMatches = item.kppn===unit || unit===null || unit==='';
    const queryMatches =
      !query ||
      Object.values(item).some(
        (value) => typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase())
      );

    return queryMatches && statusMatches && unitMatches;
  });

  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => comparator(a[0], b[0]));

  return stabilizedThis
    .filter((el) => filteredData.includes(el[0]))
    .map((el) => el[0]);
} 


export async function sanitizeRole(role: number, kppn: string) {
  if((role===3 || role===4) && kppn.length !== 5){
    return false
  };

  if((role===1 || role===2) && kppn.length === 5){
    return false
  };

  if(role===99 && kppn.length !== 5){
    return false
  };

  return true
}

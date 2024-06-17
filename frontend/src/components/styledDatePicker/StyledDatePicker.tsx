import { useTheme, styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const StyledDate = styled(DatePicker)(({theme}) => ({
  "& .MuiOutlinedInput-input": {
    fontSize: 14,
    height:'100%'
  },
  "& .MuiInputLabel-root": {
    fontSize: "13px"
  },
  "& .MuiInputLabel-shrink": {
    fontSize: '1rem',
    fontWeight: 600,
  },
}));


export default function StyledDatePicker({...props}){
  return(
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
        <StyledDate
          {...props}
        />
      </LocalizationProvider>
    </>

  )
}
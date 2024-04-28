import {useState} from "react";
import {useTheme} from "@mui/material/styles";
import {Button, Popper, Paper, Fade, ClickAwayListener, Divider} from "@mui/material";
import { DateCalendar  } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Iconify from '../../../components/iconify';
// ---------------------------------------------------------------------------------------

export default function CurrentDate() {
  const today = new Date();
  const shortMonth= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Agt', 'Sept', 'Oct', 'Nov', 'Des'];
  const date = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();

  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement, Event>) => {
      setOpen(prev => !prev);
      setAnchorEl(event.currentTarget);
  };
  const handleClose= () => {
      setOpen(false);
  };


  return(
  <>
  <Button variant="outlined" color='primary' sx={{borderRadius:'24px', height:'50px'}} onClick={handleClick}>
      <Iconify icon={"mdi:calendar"} sx={{ mr: 1, color:theme.mode==='light'?theme.palette.primary.main:theme.palette.primary.light }} />
      <span style={{color:theme.mode==='light'?theme.palette.primary.main:theme.palette.primary.light}}>{date} {shortMonth[month]} {year}</span>
  </Button>

  <Popper open={open} anchorEl={anchorEl} placement={'bottom'} transition sx={{ zIndex: 1102 }}>
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper sx={{boxShadow:"0px 5px 5px -3px rgba(145, 158, 171, 0.2), 0px 8px 10px 1px rgba(145, 158, 171, 0.14), 0px 3px 14px 2px rgba(145, 158, 171, 0.12)", borderRadius:'12px'}}>
              <ClickAwayListener onClickAway={handleClose}>
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar/>
                    </LocalizationProvider>
                  </div>
              </ClickAwayListener>

          </Paper>
        </Fade>
      )}
  </Popper>
  </>
  )
}



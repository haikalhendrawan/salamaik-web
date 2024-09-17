/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {styled, useTheme} from "@mui/material/styles";
import { Button, Box, Popper, Paper, Fade, ClickAwayListener } from "@mui/material";
import useDictionary from "../../../hooks/useDictionary";
// -----------------------------------------------------

const style = {
  boxShadow:"0px 5px 5px -3px rgba(145, 158, 171, 0.2), 0px 8px 10px 1px rgba(145, 158, 171, 0.14), 0px 3px 14px 2px rgba(145, 158, 171, 0.12)",
  p: 1,
  mt: 1.5,
  ml: 0.75,
  width: 150,
  typography: 'body2',
  borderRadius: '8px',
  display:'flex',
  flexDirection:'column'
};

const StyledButton = styled(Button)(({theme}) => ({
  color:theme.palette.text.primary,
  fontWeight:theme.typography.fontWeightRegular,
  width:'100%',
  justifyContent:'flex-start'
}));

interface PeriodSelectionPopperProps{
  open: any,
  close: any,
  changeValue: any,
  value: number
};

// ------------------------------------------------------

export default function PeriodSelectionPopper({open, close, changeValue, value}: PeriodSelectionPopperProps) {
  const theme = useTheme();

  const {periodRef} = useDictionary();

  const selectedSx= {fontWeight:theme.typography.fontWeightMedium, backgroundColor:theme.palette.background.neutral};

  return(
    <Popper
      open={Boolean(open)} 
      anchorEl={open} 
      placement={'bottom'} 
      transition sx={{ zIndex: 1102}}
    >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper sx={style}>
              <ClickAwayListener onClickAway={close}>
              <Box>
              {periodRef && periodRef?.list.map((item) => (
                <StyledButton 
                  key={item.id} 
                  value={item.id} 
                  onClick={() => changeValue(item.id)} 
                  sx={value === item.id ? selectedSx : null}>
                  {item.name}
                </StyledButton>
              ))}
                
              </Box>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
    </Popper>
  )
}
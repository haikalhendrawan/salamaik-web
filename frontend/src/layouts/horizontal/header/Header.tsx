/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton} from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/iconify';
import Logo from '../../../components/logo/Logo';
//
import Searchbar from '../../dashboard/header/Searchbar';
import AccountPopover from '../../dashboard/header/AccountPopover';
import NotificationsPopover from '../../dashboard/header/NotificationsPopover';
import CurrentDate from '../../dashboard/header/CurrentDate';
import ThemeSwitcher from '../../dashboard/header/ThemeSwitcher';
import ColorSwitcher from '../../dashboard/header/ColorSwitcher';

// ----------------------------------------------------------------------

const NAV_WIDTH = 0;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;


const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default } ), 
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------
interface HeaderType{
  onOpenNav?: any
}

export default function Header({ onOpenNav }: HeaderType) {
  return (
    <StyledRoot>
      {/* <LinearProgress /> */}
      <StyledToolbar>
        <Box sx={{ width: '200px', height: '100px', pt: 1 }}> 
          <Logo sx={{height:'100%'}} /> {/* py 3 utk short logo*/}
        </Box>

        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>

        <Searchbar />
        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          <ColorSwitcher />
          <ThemeSwitcher />
          <CurrentDate />
          <NotificationsPopover />
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}

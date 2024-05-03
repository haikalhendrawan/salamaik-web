import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import {Box} from '@mui/material';
// components
import Logo from '../../components/logo';

// ----------------------------------------------------------------------

const StyledHeader = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0),
  },
}));

// ----------------------------------------------------------------------

export default function SimpleLayout() {
  return (
    <>
      <StyledHeader>
        <Box
          component="img"
          src="/logo/salamaik-long.png"
          sx={{ width: 120, height: 30, cursor: 'pointer', position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 }, }}
        />
      </StyledHeader>

      <Outlet />
    </>
  );
}

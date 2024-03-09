// @mui
import { styled } from '@mui/material/styles';
import { ListItemIcon, ListItemButton } from '@mui/material';

// ----------------------------------------------------------------------

export const StyledNavItem = styled((props) => <ListItemButton disableGutters {...props} />)(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  position: 'relative',
  textTransform: 'capitalize',
  color: theme.palette.text.tertiary,
  borderRadius: theme.shape.borderRadius,
}));

export const StyledNavItemNested = styled((props) => <ListItemButton disableGutters {...props}  />)(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  width:'100%',
  position: 'relative',
  textTransform: 'capitalize',
  color: theme.palette.text.tertiary,
  borderRadius: theme.shape.borderRadius,
}));

export const StyledNavItemIcon = styled(ListItemIcon)({
  width: 22,
  height: 22,
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const StyledSubNavItemIcon = styled((props) => <ListItemIcon {...props} />)(({ theme }) => ({
  width: 16,
  height: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main
}));

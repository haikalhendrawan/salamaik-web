// @mui
import { styled, SxProps } from '@mui/material/styles';
import { ListItemIcon, ListItemButton } from '@mui/material';

// ----------------------------------------------------------------------
interface ThemeProp{
  theme: any
}

interface ChildrenProp{
  children?: any,
  component?: any,
  to?: string,
  target?: string,
  sx?: SxProps,
  onClick?: any
}

export const StyledNavItem = styled((props: ChildrenProp) => <ListItemButton disableGutters {...props} />)(({ theme }: ThemeProp) => ({
  ...theme.typography.body2,
  height: 44,
  position: 'relative',
  textTransform: 'capitalize',
  color: theme.palette.text.tertiary,
  borderRadius: '8px',
  marginBottom: theme.spacing(0.5),
}));

export const StyledNavItemNested = styled((props: ChildrenProp) => <ListItemButton disableGutters {...props}  />)(({ theme }: ThemeProp) => ({
  ...theme.typography.body2,
  height: 44,
  width:'100%',
  position: 'relative',
  textTransform: 'capitalize',
  color: theme.palette.text.tertiary,
  borderRadius: '8px',
  marginBottom: theme.spacing(0.5),
}));

export const StyledNavItemIcon = styled(ListItemIcon)({
  width: 22,
  height: 22,
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const StyledSubNavItemIcon = styled((props: ChildrenProp) => <ListItemIcon {...props} />)(({ theme } : ThemeProp) => ({
  width: 14,
  height: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main
}));

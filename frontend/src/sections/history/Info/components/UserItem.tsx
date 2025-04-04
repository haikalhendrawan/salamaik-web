import {Stack, Avatar, List, ListItemText, Typography} from '@mui/material';
export default function UserItem({name, avatar}: {name: string, nip: string, avatar: string}) {
  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Avatar alt={"0"} src={`${import.meta.env.VITE_API_URL}/avatar/${avatar}`}/>
        <List disablePadding dense>
          <ListItemText>
            <Typography variant="body2" noWrap>{name}</Typography>
          </ListItemText>
        </List>
      </Stack>
    </>
  )
}

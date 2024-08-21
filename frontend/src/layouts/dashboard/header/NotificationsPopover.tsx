import { noCase } from 'change-case';
import React, { useState, useEffect } from 'react';
// @mui
import {Box, List, Badge, Avatar, Tooltip, Divider, Popover, 
          Typography, IconButton, ListItemText, ListItemAvatar, ListItemButton} from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
// custom hooks
import useAxiosJWT from "../../../hooks/useAxiosJWT";

// ----------------------------------------------------------------------
interface Notif{
  junction_id: number,
  notif_id: number,
  creator_id: string,
  receiver_id: string,
  status: number,
  completed_at: string | null,
  assigned_at: string,
  message: string | null,
  title: string | null,
  created_at: string,
  categories: number | null,
}

export default function NotificationsPopover() {
  const axiosJWT = useAxiosJWT();

  const [notifications, setNotifications] = useState<Notif[] | []>([]);

  const totalUnread = notifications?.filter((item: Notif) => item?.status===0).length;

  const [open, setOpen] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement | null>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = async() => {
    notifications?.map(async(item) => {
      try{
        await axiosJWT.post('/updateNotif', {junctionID:item.junction_id});
        getNotif();
      }catch(err){
        console.log(err)
      }
    })
  };

  const getNotif= async()=>{
    try{
      const response = await axiosJWT.get("/getNotifById"); 
      setNotifications(response.data);
    }catch(err){
      console.log(err);
    }
  };

  const handleHover = async(notifId: string | number) => {
    try{
      await axiosJWT.post('/updateNotif', {junctionID:notifId})
      getNotif();
    }catch(err){
      console.log(err)
    }
  }

  useEffect( () => {
    getNotif(); 
  }, []);


  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={totalUnread} color="error">
          <Iconify icon="eva:bell-fill" />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={
          {
            paper:{sx:{mt:1.5, ml:0.75, width:360, borderRadius:'12px'}}
          }
        }
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnread} unread messages
            </Typography>
          </Box>

          {totalUnread > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
          >
            {notifications?.slice(0, 5).map((notification, index) => (
              <NotificationItem  
                key={index+1} 
                notification={notification} 
                onMouseEnter={() => handleHover(notification.junction_id)}/>
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {/* <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box> */}
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

interface NotifItemPropType{
  notification: Notif,
  onMouseEnter: (notifId: string | number) => void
}

function NotificationItem({ notification, onMouseEnter }: NotifItemPropType) {
  const { avatar, title } = renderContent(notification);
  const {junction_id:notifId, status} = notification;

  const handleMouseEnter = () => {
    status===0 && onMouseEnter(notifId)
  }

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.status===0 && {
          bgcolor: 'action.selected',
        }),
      }}
      onMouseEnter={handleMouseEnter}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(new Date(notification.assigned_at))}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification:Notif) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.message?noCase(notification.message):null}
      </Typography>
    </Typography>
  );

  const avatar = (
    <img 
      alt={notification.title ?? ''} 
      src={notification.categories===0?"/icon/ic_notification_mail.svg":"/icon/ic_notification_package.svg"}
    />
  );

  return {
    avatar,
    title,
  };
}

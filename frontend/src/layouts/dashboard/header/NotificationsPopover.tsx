import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import React, { useState, useEffect } from 'react';
// @mui
import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Popover,
  Typography,
  IconButton,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  Paper,
} from '@mui/material';
// utils
import { fToNow } from '../../../utils/formatTime';
// components
import Iconify from '../../../components/iconify';
import Scrollbar from '../../../components/scrollbar';
// custom hooks
import useAxiosJWT from "../../../hooks/useAxiosJWT";

// ----------------------------------------------------------------------



// Data notification dari API: 
// {assigned_at:xxx, completed_at:xxx, creator_fk_id:xx, notif_created_at:xxx, notif_fk_id:xxx, notif_id:xxx, 
//   notif_junction_id:xxx,notif_type:xxx, notif_msg:xxx, notif_title:xxx, receiver_fk_id:xxx, status:xxx }
interface Notif{
  assigned_at:Date, 
  completed_at:Date, 
  creator_fk_id:string | number, 
  notif_created_at:Date, 
  notif_fk_id:string | number, 
  notif_id:string | number, 
  notif_junction_id:string | number,
  notif_type:string | number, 
  notif_msg:string, 
  notif_title:string, 
  receiver_fk_id:string | number, 
  status:string | number
}

export default function NotificationsPopover() {
  const axiosJWT = useAxiosJWT();

  const [notifications, setNotifications] = useState<Notif[]>([]);

  const totalUnRead = notifications?.filter((item: Notif) => item?.status===0).length;

  const [open, setOpen] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement | null>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        status : 1
      }))
    );
  };

  const getNotif= async()=>{
    try{
    const response = await axiosJWT.get("/getNotif"); 
    setNotifications(response.data);     
    }catch(err){
      console.log(err);
    }
  };

  const handleHover = async(notifId: string | number) => {
    try{
      const response = await axiosJWT.post('/updateNotif', {notifJunctionId:notifId})
      console.log(response.data);
      getNotif();
    }catch(err){
      console.log(err)
    }
  }

  // useEffect( () => {
  //   getNotif(); 
  // }, []);


  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={totalUnRead} color="error">
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
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
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
            onClick={handleMarkAllAsRead}
          >
            {notifications?.slice(0, 5).map((notification) => (
              <NotificationItem  key={notification.notif_id} notification={notification} onMouseEnter={handleHover}/>
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

interface NotifItemPropType{
  key: string | number,
  notification: Notif,
  onMouseEnter: (notifId: string | number) => void
}

// Data notification dari API: 
// {assigned_at:xxx, completed_at:xxx, creator_fk_id:xx, notif_created_at:xxx, notif_fk_id:xxx, notif_id:xxx, 
//   notif_junction_id:xxx, notif_msg:xxx, notif_title:xxx, receiver_fk_id:xxx, status:xxx }

function NotificationItem({ key, notification, onMouseEnter }: NotifItemPropType) {
  const { avatar, title } = renderContent(notification);
  const {notif_junction_id:notifId, status} = notification;

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
            {fToNow(notification.assigned_at)}
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
      {notification.notif_title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification.notif_msg)}
      </Typography>
    </Typography>
  );

  // if (notification.type === 'order_placed') {
  //   return {
  //     avatar: <img alt={notification.title} src="/assets/icons/ic_notification_package.svg" />,
  //     title,
  //   };
  // }
  // if (notification.type === 'mail') {
  //   return {
  //     avatar: <img alt={notification.title} src="/assets/icons/ic_notification_mail.svg" />,
  //     title,
  //   };
  // }
  // if (notification.type === 'chat_message') {
  //   return {
  //     avatar: <img alt={notification.title} src="/assets/icons/ic_notification_chat.svg" />,
  //     title,
  //   };
  // }
  return {
    avatar: <img alt={notification.notif_title} src="/assets/icons/ic_notification_mail.svg" /> ,
    title,
  };
}

/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Iconify from "../../../../components/iconify";
import Badge from '@mui/material/Badge';
import styled  from '@mui/material/styles/styled';
import { parseISO, format } from 'date-fns';
// ------------------------------------------------------------
interface HeadPropInterface{
  num: number | string | undefined,
  title:string,
  dateUpdated: string | null,
  updatedBy: string | null,
  openComment: (event: React.MouseEvent<HTMLButtonElement>) => void,
  commentCount: number
};

const StyledIconButton = styled(IconButton)(({}) => ({
  color: 'rgb(0, 167, 111)',
  borderRadius: '50%',
}));

const MainStack = styled(Stack)(({theme}) => ({
  justifyContent:'space-between',
  marginLeft: theme.spacing(1),
}));

const SubStack = styled(Stack)(({}) => ({
  alignItems:'center'
}));

// ------------------------------------------------------------
export default function Head(props: HeadPropInterface) {  // bagian atas dari card
  const dateUpdated = props?.dateUpdated ? format(parseISO(props.dateUpdated), 'dd/MM/yyyy - HH:mm:ss') : null;
  const tooltipText = <div>Last update: {dateUpdated} <br/> By: {props.updatedBy}</div>;
  const isUpdate = props?.dateUpdated;

  return(
  <>
    <MainStack direction="row" spacing={2}>
      <SubStack direction="row" spacing={1}>
          <Typography variant="h6" fontSize={14} marginLeft={1} >{`${props.num}`}</Typography>
          <Stack >
            <Typography variant="body1" fontSize={15} >{props.title}</Typography>
          </Stack>
      </SubStack>
      <SubStack direction="row" spacing={0}>
        {isUpdate ?
          <Tooltip title={tooltipText} placement="left-start">
            <StyledIconButton disableRipple><Iconify icon={"solar:check-circle-bold"} /></StyledIconButton>
          </Tooltip> : null
        }
        <Tooltip title="Comment" placement="left-start">
          <StyledIconButton onClick={props.openComment} disableRipple>
            <Badge badgeContent={props.commentCount} color="primary" max={99} invisible={props.commentCount === 0}>
              <Iconify icon="solar:chat-round-dots-bold" />
            </Badge>
          </StyledIconButton>
        </Tooltip>
      </SubStack>

    </MainStack>
  </>
  )
}

import { useEffect, useState } from 'react';
import { Badge, IconButton, Tooltip } from '@mui/material';
import Iconify from '../../../../../components/iconify';
import CommentPopoverSPML from '../../CommentPopoverSPML';

interface CommentActionProps {
  wsSPMLJunctionId: number;
  initialCommentCount: number;
}

export default function CommentAction({ wsSPMLJunctionId, initialCommentCount }: CommentActionProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [commentCount, setCommentCount] = useState(initialCommentCount);

  useEffect(() => {
    setCommentCount(initialCommentCount);
  }, [initialCommentCount]);

  return (
    <>
      <Tooltip title="Comment">
        <IconButton
          aria-label="Buka komentar checklist SPML"
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <Badge 
            badgeContent={commentCount} 
            color="primary" 
            max={99} 
            invisible={commentCount === 0}
          >
            <Iconify icon="solar:chat-round-dots-outline" />
          </Badge>
        </IconButton>
      </Tooltip>
      <CommentPopoverSPML
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        handleClose={() => setAnchorEl(null)}
        wsSPMLJunctionId={wsSPMLJunctionId}
        onCommentCountChange={setCommentCount}
      />
    </>
  );
}

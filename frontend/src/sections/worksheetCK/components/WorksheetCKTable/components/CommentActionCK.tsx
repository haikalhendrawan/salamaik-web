import { useEffect, useState } from 'react';
import { Badge, IconButton, Tooltip } from '@mui/material';
import Iconify from '../../../../../components/iconify';
import CommentPopoverCK from '../../CommentPopoverCK';

interface CommentActionCKProps {
  junctionId: number;
  initialCount: number;
  disabled: boolean;
}

export default function CommentActionCK({ junctionId, initialCount, disabled }: CommentActionCKProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [count, setCount] = useState(initialCount);

  useEffect(() => setCount(initialCount), [initialCount]);

  return (
    <>
      <Tooltip title={disabled ? 'Lihat komentar (periode telah ditutup)' : 'Comment'}>
        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)} aria-label="Buka komentar CK">
          <Badge badgeContent={count} color="primary" max={99} invisible={count === 0}>
            <Iconify icon="solar:chat-round-dots-outline" />
          </Badge>
        </IconButton>
      </Tooltip>
      <CommentPopoverCK
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        junctionId={junctionId}
        onCountChange={setCount}
        disabled={disabled}
      />
    </>
  );
}

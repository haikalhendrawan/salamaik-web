import { useCallback, useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  CircularProgress,
  ClickAwayListener,
  FormControl,
  Grow,
  Link,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { format, parseISO } from 'date-fns';
import { isAxiosError } from 'axios';
import { useAuth } from '../../../hooks/useAuth';
import useAxiosJWT from '../../../hooks/useAxiosJWT';
import useSnackbar from '../../../hooks/display/useSnackbar';
import StyledTextField from '../../../components/styledTextField/StyledTextField';
import StyledButton from '../../../components/styledButton/StyledButton';
import Iconify from '../../../components/iconify';
import useWsCKJunction from '../useWsCKJunction';

interface CommentCKType {
  id: number;
  ws_ck_junction_id: number;
  user_id: string;
  comment: string;
  created_at: string;
  name: string;
  picture: string | null;
}

interface CommentPopoverCKProps {
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
  junctionId: number;
  onCountChange: (count: number) => void;
  disabled: boolean;
}

const CommentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: theme.spacing(1),
  background: theme.palette.background.neutral,
  display: 'flex',
  width: '100%',
}));

export default function CommentPopoverCK({
  anchorEl,
  onClose,
  junctionId,
  onCountChange,
  disabled,
}: CommentPopoverCKProps) {
  const theme = useTheme();
  const axiosJWT = useAxiosJWT();
  const { openSnackbar } = useSnackbar();
  const { lastLiveChange } = useWsCKJunction();
  const [comments, setComments] = useState<CommentCKType[]>([]);
  const [loading, setLoading] = useState(true);
  const open = Boolean(anchorEl);

  const showError = useCallback((error: unknown) => {
    const message = isAxiosError<{ message?: string }>(error)
      ? error.response?.data?.message || error.message
      : error instanceof Error ? error.message : 'Unknown error';
    openSnackbar(message, 'error');
  }, [openSnackbar]);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosJWT.get(`/comment/getByWsCKJunctionId/${junctionId}`);
      const rows: CommentCKType[] = response.data.rows;
      setComments(rows);
      onCountChange(rows.length);
    } catch (error: unknown) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }, [axiosJWT, junctionId, onCountChange, showError]);

  useEffect(() => {
    if (open) void refresh();
    else {
      setComments([]);
      setLoading(true);
    }
  }, [open, refresh]);

  useEffect(() => {
    if (
      open &&
      lastLiveChange?.junctionId === junctionId &&
      ['comment-add', 'comment-delete'].includes(lastLiveChange.changeType)
    ) {
      void refresh();
    }
  }, [junctionId, lastLiveChange, open, refresh]);

  return (
    <Popper open={open} anchorEl={anchorEl} placement="bottom-end" transition sx={{ zIndex: 9999 }}>
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} timeout={200}>
          <Paper
            sx={{
              p: 2,
              mt: 1.5,
              width: 'min(600px, calc(100vw - 32px))',
              maxHeight: '70vh',
              overflowY: 'auto',
              boxShadow: theme.customShadows.dialog,
            }}
          >
            <ClickAwayListener onClickAway={onClose}>
              <Stack spacing={2}>
                {loading ? (
                  <Box textAlign="center" py={2}><CircularProgress size={28} /></Box>
                ) : comments.length ? (
                  comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      refresh={refresh}
                      showError={showError}
                      disabled={disabled}
                    />
                  ))
                ) : (
                  <Typography variant="body2">Belum ada komentar.</Typography>
                )}
                <NewComment junctionId={junctionId} refresh={refresh} showError={showError} disabled={disabled} />
              </Stack>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}

function NewComment({
  junctionId,
  refresh,
  showError,
  disabled,
}: {
  junctionId: number;
  refresh: () => Promise<void>;
  showError: (error: unknown) => void;
  disabled: boolean;
}) {
  const { auth } = useAuth();
  const axiosJWT = useAxiosJWT();
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);

  const add = async () => {
    if (disabled || !value.trim()) return;
    try {
      setSaving(true);
      await axiosJWT.post('/comment/addCK', {
        wsCKJunctionId: junctionId,
        commentBody: value.trim(),
      });
      setValue('');
      await refresh();
    } catch (error: unknown) {
      showError(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack direction="row" spacing={1}>
      <Avatar src={auth?.picture ? `${import.meta.env.VITE_API_URL}/avatar/${auth.picture}` : ''} />
      <FormControl fullWidth size="small">
        <StyledTextField
          size="small"
          multiline
          placeholder={disabled ? 'Periode kertas kerja telah ditutup' : 'Tulis komentar baru...'}
          value={value}
          disabled={disabled}
          inputProps={{ maxLength: 2000 }}
          onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(event.target.value)}
        />
      </FormControl>
      <StyledButton
        variant="contained"
        size="small"
        sx={{ minWidth: 40 }}
        onClick={add}
        disabled={disabled || saving || !value.trim()}
      >
        <Iconify icon="solar:plain-bold" />
      </StyledButton>
    </Stack>
  );
}

function CommentItem({
  comment,
  refresh,
  showError,
  disabled,
}: {
  comment: CommentCKType;
  refresh: () => Promise<void>;
  showError: (error: unknown) => void;
  disabled: boolean;
}) {
  const { auth } = useAuth();
  const axiosJWT = useAxiosJWT();
  const canDelete = comment.user_id === auth?.id && !disabled;

  const remove = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    try {
      await axiosJWT.post('/comment/deleteById', { id: comment.id });
      await refresh();
    } catch (error: unknown) {
      showError(error);
    }
  };

  return (
    <Stack direction="row" spacing={1}>
      <Avatar src={comment.picture ? `${import.meta.env.VITE_API_URL}/avatar/${comment.picture}` : ''} />
      <Stack width="100%" spacing={0.5}>
        <CommentPaper elevation={0}>
          <Stack width="100%">
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" fontWeight={700}>{comment.name}</Typography>
              <Typography variant="caption">{format(parseISO(comment.created_at), 'dd/MM/yyyy HH:mm')}</Typography>
            </Stack>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
              {comment.comment}
            </Typography>
          </Stack>
        </CommentPaper>
        {canDelete && <Link href="#" textAlign="right" fontSize={12} onClick={remove}>Delete</Link>}
      </Stack>
    </Stack>
  );
}

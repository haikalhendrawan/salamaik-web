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
import useWsSPMLJunction from '../useWsSPMLJunction';

interface CommentType {
  id: number;
  ws_spml_junction_id: number;
  user_id: string;
  comment: string;
  created_at: string;
  active: number;
  name: string;
  picture: string | null;
}

interface CommentPopoverSPMLProps {
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  handleClose: () => void;
  wsSPMLJunctionId: number;
  onCommentCountChange?: (count: number) => void;
  isPastDue: boolean;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: theme.spacing(1),
  background: theme.palette.background.neutral,
  display: 'flex',
  width: '100%',
}));

export default function CommentPopoverSPML({
  open,
  anchorEl,
  handleClose,
  wsSPMLJunctionId,
  onCommentCountChange,
  isPastDue,
}: CommentPopoverSPMLProps) {
  const theme = useTheme();
  const axiosJWT = useAxiosJWT();
  const { openSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentType[]>([]);
  const { lastLiveChange } = useWsSPMLJunction();

  const showError = useCallback((err: unknown) => {
    if (isAxiosError<{ message?: string }>(err)) {
      openSnackbar(err.response?.data?.message || err.message, 'error');
      return;
    }
    openSnackbar(err instanceof Error ? err.message : 'Unknown error', 'error');
  }, [openSnackbar]);

  const getComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosJWT.get(
        `/comment/getByWsSPMLJunctionId/${wsSPMLJunctionId}`
      );
      const rows: CommentType[] = response.data.rows;
      setComments(rows);
      onCommentCountChange?.(rows.length);
    } catch (err: unknown) {
      showError(err);
    } finally {
      setLoading(false);
    }
  }, [axiosJWT, onCommentCountChange, showError, wsSPMLJunctionId]);

  useEffect(() => {
    if (open) {
      getComments();
    } else {
      setLoading(true);
      setComments([]);
    }
  }, [getComments, open]);

  useEffect(() => {
    if (
      open &&
      lastLiveChange?.junctionId === wsSPMLJunctionId &&
      (lastLiveChange.changeType === 'comment-add' || lastLiveChange.changeType === 'comment-delete')
    ) {
      getComments();
    }
  }, [getComments, lastLiveChange, open, wsSPMLJunctionId]);

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
              borderRadius: '8px',
              boxShadow: theme.customShadows.dialog,
            }}
          >
            <ClickAwayListener onClickAway={handleClose}>
              <Stack spacing={2}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={28} />
                  </Box>
                ) : comments.length > 0 ? (
                  comments.map((item) => (
                    <CommentItem
                      key={item.id}
                      comment={item}
                      refreshComments={getComments}
                      showError={showError}
                      isPastDue={isPastDue}
                    />
                  ))
                ) : (
                  <Typography variant="body2" fontSize={12}>
                    Belum ada komentar.
                  </Typography>
                )}

                <NewComment
                  wsSPMLJunctionId={wsSPMLJunctionId}
                  refreshComments={getComments}
                  showError={showError}
                  isPastDue={isPastDue}
                />
              </Stack>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}

function NewComment({
  wsSPMLJunctionId,
  refreshComments,
  showError,
  isPastDue,
}: {
  wsSPMLJunctionId: number;
  refreshComments: () => Promise<void>;
  showError: (err: unknown) => void;
  isPastDue: boolean;
}) {
  const { auth } = useAuth();
  const axiosJWT = useAxiosJWT();
  const [commentBody, setCommentBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async () => {
    if (isPastDue) return;

    const normalizedComment = commentBody.trim();
    if (!normalizedComment) return;

    try {
      setSubmitting(true);
      await axiosJWT.post('/comment/addSPML', {
        wsSPMLJunctionId,
        commentBody: normalizedComment,
      });
      setCommentBody('');
      await refreshComments();
    } catch (err: unknown) {
      showError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack direction="row" spacing={1} width="100%">
      <Avatar src={auth?.picture ? `${import.meta.env.VITE_API_URL}/avatar/${auth.picture}` : ''} />
      <Stack direction="row" width="100%" spacing={1}>
        <FormControl size="small" fullWidth>
          <StyledTextField
            placeholder={isPastDue ? 'Periode kertas kerja telah ditutup' : 'Tulis komentar baru...'}
            size="small"
            fontSize={12}
            multiline
            value={commentBody}
            inputProps={{ maxLength: 2000 }}
            disabled={isPastDue}
            onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              setCommentBody(event.target.value)
            }
          />
        </FormControl>
        <StyledButton
          variant="contained"
          color="primary"
          size="small"
          sx={{ width: 40 }}
          onClick={handleAdd}
          disabled={isPastDue || submitting || !commentBody.trim()}
          aria-label="Kirim komentar SPML"
        >
          <Iconify icon="solar:plain-bold" />
        </StyledButton>
      </Stack>
    </Stack>
  );
}

function CommentItem({
  comment,
  refreshComments,
  showError,
  isPastDue,
}: {
  comment: CommentType;
  refreshComments: () => Promise<void>;
  showError: (err: unknown) => void;
  isPastDue: boolean;
}) {
  const { auth } = useAuth();
  const axiosJWT = useAxiosJWT();
  const isCreator = comment.user_id === auth?.id;

  const handleDelete = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (isPastDue) return;

    try {
      await axiosJWT.post('/comment/deleteById', { id: comment.id });
      await refreshComments();
    } catch (err: unknown) {
      showError(err);
    }
  };

  return (
    <Stack direction="row" spacing={1}>
      <Avatar src={comment.picture ? `${import.meta.env.VITE_API_URL}/avatar/${comment.picture}` : ''} />
      <Stack direction="column" spacing={1} width="100%">
        <StyledPaper elevation={0}>
          <Stack direction="column" width="100%">
            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Typography variant="body2" fontWeight="bold">{comment.name}</Typography>
              <Typography variant="caption">
                {format(parseISO(comment.created_at), 'dd/MM/yyyy HH:mm')}
              </Typography>
            </Stack>
            <Typography variant="body2" fontSize={12} sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
              {comment.comment}
            </Typography>
          </Stack>
        </StyledPaper>
        {isCreator && !isPastDue && (
          <Stack direction="row" justifyContent="flex-end">
            <Link href="#" fontSize={12} mr={2} onClick={handleDelete}>
              Delete
            </Link>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

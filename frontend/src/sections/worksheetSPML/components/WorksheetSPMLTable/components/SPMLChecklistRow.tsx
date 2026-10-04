/* eslint-disable react-refresh/only-export-components */
import { memo } from 'react';
import { Stack, styled, TableCell, TableRow, Typography } from '@mui/material';
import { AspekSpmlRefType } from '../../../../../hooks/useDictionary';
import formatNumberedList from '../../../../../utils/formatNumberedList';
import { WsSPMLJunctionType } from '../../../types';
import CommentAction from './CommentAction';
import FileActions from './FileActions';
import KanwilNote from './KanwilNote';
import ScoreSelect from './ScoreSelect';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: '12px',
  textAlign: 'left',
  color: theme.palette.text.secondary,
  whiteSpace: 'normal',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
}));

interface SPMLChecklistRowProps {
  checklist: WsSPMLJunctionType;
  aspek?: AspekSpmlRefType;
  aspekRowSpan?: number;
  isKanwil: boolean;
  isPastDue: boolean;
  isFinding?: boolean;
}

function SPMLChecklistRow({
  checklist,
  aspek,
  aspekRowSpan,
  isKanwil,
  isPastDue,
  isFinding = false,
}: SPMLChecklistRowProps) {
  return (
    <TableRow id={`spml-checklist-${checklist.junction_id}`} sx={{ bgcolor: isFinding ? 'warning.lighter' : undefined }}>
      {aspek && (
        <>
          <StyledTableCell rowSpan={aspekRowSpan}>{aspek.urut}</StyledTableCell>
          <StyledTableCell rowSpan={aspekRowSpan}>
            <Stack spacing={aspek.keterangan_tambahan ? 1 : 0}>
              <Typography component="span" sx={{ fontSize: 12, color: 'inherit' }}>{aspek.title}</Typography>
              {aspek.keterangan_tambahan && (
                <Typography component="span" sx={{ fontSize: 11, color: 'text.secondary', whiteSpace: 'pre-line' }}>
                  {aspek.keterangan_tambahan}
                </Typography>
              )}
            </Stack>
          </StyledTableCell>
        </>
      )}
      <StyledTableCell>{formatNumberedList(checklist.uraian)}</StyledTableCell>
      <StyledTableCell>
        <ScoreSelect checklist={checklist} scoreType="kppn" disabled={isKanwil || isPastDue} />
      </StyledTableCell>
      <StyledTableCell>
        <ScoreSelect checklist={checklist} scoreType="kanwil" disabled={!isKanwil || isPastDue} />
      </StyledTableCell>
      <StyledTableCell>
        <FileActions checklist={checklist} isPastDue={isPastDue} />
      </StyledTableCell>
      <StyledTableCell>
        <KanwilNote checklist={checklist} isPastDue={isPastDue} />
      </StyledTableCell>
      <StyledTableCell sx={{ textAlign: 'center' }}>
        <CommentAction
          wsSPMLJunctionId={checklist.junction_id}
          initialCommentCount={Number(checklist.comment_count) || 0}
          isPastDue={isPastDue}
        />
      </StyledTableCell>
    </TableRow>
  );
}

export default memo(SPMLChecklistRow);

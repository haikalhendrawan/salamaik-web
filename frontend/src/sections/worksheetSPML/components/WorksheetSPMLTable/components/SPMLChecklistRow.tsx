/* eslint-disable react-refresh/only-export-components */
import { memo } from 'react';
import { styled, TableCell, TableRow } from '@mui/material';
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
}

function SPMLChecklistRow({
  checklist,
  aspek,
  aspekRowSpan,
  isKanwil,
  isPastDue,
}: SPMLChecklistRowProps) {
  return (
    <TableRow id={`spml-checklist-${checklist.junction_id}`}>
      {aspek && (
        <>
          <StyledTableCell rowSpan={aspekRowSpan}>{aspek.urut}</StyledTableCell>
          <StyledTableCell rowSpan={aspekRowSpan}>{aspek.title}</StyledTableCell>
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

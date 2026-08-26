import { CircularProgress, TableCell, Tooltip } from '@mui/material';
import { SPMLScoreDetail } from '../../../types';

interface ScoreFooterCellProps {
  value: number | undefined;
  detail: SPMLScoreDetail | undefined;
  loading: boolean;
  label: string;
}

export default function ScoreFooterCell({
  value,
  detail,
  loading,
  label,
}: ScoreFooterCellProps) {
  const tooltip = detail
    ? `${label} — Total checklist: ${detail.jumlahChecklist}, N/A: ${detail.jumlahNA}, Pembagi: ${detail.jumlahChecklistPembagi}, Total skor konversi: ${detail.totalSkorKonversi}`
    : '';

  return (
    <TableCell
      align="center"
      sx={{ fontWeight: 'bold', color: 'text.primary', backgroundColor: 'background.default' }}
    >
      {loading && value === undefined ? (
        <CircularProgress size={18} />
      ) : (
        <Tooltip title={tooltip} disableHoverListener={!detail}>
          <span>{value === undefined ? '-' : value.toFixed(2)}</span>
        </Tooltip>
      )}
      {loading && value !== undefined && <CircularProgress size={12} sx={{ ml: 1 }} />}
    </TableCell>
  );
}

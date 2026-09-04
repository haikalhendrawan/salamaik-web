import { CircularProgress, TableCell, Tooltip } from '@mui/material';
import { CKScoreDetail } from '../../../types';

interface ScoreFooterCellCKProps {
  value: number | undefined;
  detail: CKScoreDetail | undefined;
  loading: boolean;
  label: string;
  decimals?: number;
}

export default function ScoreFooterCellCK({
  value,
  detail,
  loading,
  label,
  decimals,
}: ScoreFooterCellCKProps) {
  const tooltip = detail
    ? `${label} — Total checklist: ${detail.jumlahChecklist}, terisi: ${detail.jumlahChecklistDiisi}, N/A: ${detail.jumlahNA}, pembagi: ${detail.jumlahChecklistPembagi}, total skor konversi: ${detail.totalSkorKonversi}`
    : '';
  const displayValue = value === undefined
    ? '-'
    : decimals === undefined
      ? value
      : value.toFixed(decimals);

  return (
    <TableCell
      align="center"
      sx={{ bgcolor: 'grey.200', color: 'text.primary', fontWeight: 700 }}
    >
      {loading && value === undefined ? (
        <CircularProgress size={18} />
      ) : (
        <Tooltip title={tooltip} disableHoverListener={!detail}>
          <span>{displayValue}</span>
        </Tooltip>
      )}
      {loading && value !== undefined && <CircularProgress size={12} sx={{ ml: 1 }} />}
    </TableCell>
  );
}

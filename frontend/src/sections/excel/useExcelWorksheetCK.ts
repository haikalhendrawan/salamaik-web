import ExcelJS from 'exceljs';
import formatOrderedTitle from '../../utils/formatOrderedTitle';
import { CKScoreType, WsCKJunctionType } from '../worksheetCK/types';

type ScoreOwner = 'kppn' | 'kanwil';

const BORDER: Partial<ExcelJS.Borders> = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

export default function useExcelWorksheetCK({
  rows,
  kppnName,
  ckScore,
}: {
  rows: WsCKJunctionType[];
  kppnName: string;
  ckScore: CKScoreType | null;
}) {
  const generate = async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Salamaik Web';
    workbook.created = new Date();

    createSheet(workbook, 'Nilai Versi Kanwil', 'kanwil', rows, kppnName, ckScore);
    createSheet(workbook, 'Nilai Versi KPPN', 'kppn', rows, kppnName, ckScore);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Worksheet_CK_${safeFileName(kppnName || 'KPPN')}_${Date.now()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return { generate };
}

function createSheet(
  workbook: ExcelJS.Workbook,
  name: string,
  owner: ScoreOwner,
  rows: WsCKJunctionType[],
  kppnName: string,
  ckScore: CKScoreType | null
) {
  const sheet = workbook.addWorksheet(name, { views: [{ state: 'frozen', ySplit: 2 }] });
  sheet.columns = [
    { key: 'no', width: 7 },
    { key: 'materi', width: 31 },
    { key: 'kriteria', width: 35 },
    { key: 'bukti', width: 34 },
    { key: 'link', width: 34 },
    { key: 'nilai', width: 15 },
    { key: 'konversi', width: 17 },
  ];

  sheet.mergeCells('A1:A2');
  sheet.mergeCells('B1:B2');
  sheet.mergeCells('C1:C2');
  sheet.mergeCells('D1:D2');
  sheet.mergeCells('E1:E2');
  sheet.mergeCells('F1:G1');
  sheet.getCell('A1').value = 'No';
  sheet.getCell('B1').value = 'Materi';
  sheet.getCell('C1').value = 'Kriteria Penilaian';
  sheet.getCell('D1').value = 'BUKTI DUKUNG KEGIATAN';
  sheet.getCell('E1').value = 'LINK BUKTI DUKUNG KEGIATAN';
  sheet.getCell('F1').value = `KPPN ${kppnName}`;
  sheet.getCell('F2').value = 'Nilai\n*jika tidak mempunyai transaksi maka kolom diisi "N/A"';
  sheet.getCell('G2').value = 'Nilai Konversi';
  styleHeader(sheet, 1, 2);

  const groups = new Map<number, WsCKJunctionType[]>();
  rows.forEach((row) => groups.set(row.komponen_ck_id, [...(groups.get(row.komponen_ck_id) || []), row]));

  groups.forEach((componentRows) => {
    const component = componentRows[0];
    const sectionRow = sheet.addRow([
      formatOrderedTitle(component.komponen_urut, component.komponen_title),
    ]);
    sheet.mergeCells(`A${sectionRow.number}:G${sectionRow.number}`);
    for (let column = 1; column <= 7; column += 1) {
      const cell = sectionRow.getCell(column);
      cell.border = BORDER;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
      cell.font = { bold: true, name: 'Calibri', size: 11 };
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    }
    sectionRow.height = 23;

    componentRows.forEach((junction) => addChecklistRow(sheet, junction, owner));
  });

  const detail = owner === 'kanwil' ? ckScore?.detailKanwil : ckScore?.detailKPPN;
  const finalScore = owner === 'kanwil' ? ckScore?.nilaiKanwil : ckScore?.nilaiKPPN;
  addFooter(sheet, 'Total Nilai', detail?.totalSkorKonversi);
  addFooter(sheet, 'Rata-Rata Total Nilai', finalScore, '0.00');
  return sheet;
}

function styleHeader(sheet: ExcelJS.Worksheet, startRow: number, endRow: number) {
  for (let rowNumber = startRow; rowNumber <= endRow; rowNumber += 1) {
    const row = sheet.getRow(rowNumber);
    row.height = rowNumber === 2 ? 48 : 26;
    for (let column = 1; column <= 7; column += 1) {
      const cell = row.getCell(column);
      cell.border = BORDER;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBFBFBF' } };
      cell.font = { bold: true, name: 'Calibri', size: 11 };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    }
  }
}

function addChecklistRow(
  sheet: ExcelJS.Worksheet,
  junction: WsCKJunctionType,
  owner: ScoreOwner
) {
  const score = owner === 'kanwil' ? junction.kanwil_score : junction.kppn_score;
  const displayedScore = junction.excluded === 1 ? 'N/A' : score ?? '';
  const convertedScore = junction.excluded === 1 ? 'N/A' : score == null ? '' : score * 10;
  const criteria = [
    junction.kriteria_penilaian,
    ...(junction.opsi || [])
      .slice()
      .sort((left, right) => left.urut - right.urut)
      .flatMap((option) => [
        `- Nilai ${option.value}${option.label ? ` (${option.label})` : ''}`,
        option.description || '',
      ]),
  ].filter(Boolean).join('\n');
  const row = sheet.addRow([
    junction.checklist_urut,
    junction.materi,
    criteria,
    junction.bukti_dukung || '',
    '',
    displayedScore,
    convertedScore,
  ]);

  for (let column = 1; column <= 7; column += 1) {
    const cell = row.getCell(column);
    cell.border = BORDER;
    cell.font = { name: 'Calibri', size: 10 };
    cell.alignment = {
      vertical: 'top',
      horizontal: [1, 6, 7].includes(column) ? 'center' : 'left',
      wrapText: true,
    };
  }
  setEvidenceLinks(row, junction);
  row.height = estimateRowHeight(row);
}

function setEvidenceLinks(row: ExcelJS.Row, junction: WsCKJunctionType) {
  const urls: string[] = [];
  const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  if (junction.file_1) urls.push(`${apiUrl}/worksheet/${junction.file_1}`);
  if (junction.link_file?.trim()) {
    const external = junction.link_file.trim();
    urls.push(/^https?:\/\//i.test(external) ? external : `https://${external}`);
  }

  const cell = row.getCell(5);
  const text = urls.map((url) => url.match(/.{1,45}/g)?.join('\n') || url).join('\n\n');
  if (urls.length === 1) {
    cell.value = { text, hyperlink: urls[0], tooltip: urls[0] };
  } else if (urls.length > 1) {
    cell.value = { text, hyperlink: urls[0], tooltip: urls.join('\n\n') };
  } else {
    cell.value = '';
  }
  if (urls.length) cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF0563C1' }, underline: true };
}

function estimateRowHeight(row: ExcelJS.Row) {
  const widths = [7, 31, 35, 34, 34, 15, 17];
  let lines = 1;
  row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
    const raw = typeof cell.value === 'object' && cell.value && 'text' in cell.value
      ? String(cell.value.text)
      : String(cell.value ?? '');
    const explicitLines = raw.split('\n').reduce(
      (total, line) => total + Math.max(1, Math.ceil(line.length / Math.max(widths[columnNumber - 1] - 2, 5))),
      0
    );
    lines = Math.max(lines, explicitLines);
  });
  return Math.min(Math.max(lines * 13, 22), 240);
}

function addFooter(
  sheet: ExcelJS.Worksheet,
  label: string,
  value: number | undefined,
  numberFormat?: string
) {
  const row = sheet.addRow([label, '', '', '', '', '', value ?? null]);
  sheet.mergeCells(`A${row.number}:F${row.number}`);
  for (let column = 1; column <= 7; column += 1) {
    const cell = row.getCell(column);
    cell.border = BORDER;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBFBFBF' } };
    cell.font = { bold: true, name: 'Calibri', size: 11 };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  }
  if (numberFormat) row.getCell(7).numFmt = numberFormat;
  row.height = 24;
}

function safeFileName(value: string) {
  return value.replace(/[\\/:*?"<>|]/g, '_');
}

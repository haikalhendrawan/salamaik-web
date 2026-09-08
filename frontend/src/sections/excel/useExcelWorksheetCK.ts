import ExcelJS from 'exceljs';
import formatOrderedTitle from '../../utils/formatOrderedTitle';
import { CKScoreType, WsCKJunctionType } from '../worksheetCK/types';

const BORDER: Partial<ExcelJS.Borders> = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

export interface ExcelWorksheetCKParams {
  rows: WsCKJunctionType[];
  kppnName: string;
  ckScore: CKScoreType | null;
}

export async function generateExcelWorksheetCK({
  rows,
  kppnName,
  ckScore,
}: ExcelWorksheetCKParams) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Salamaik Web';
  workbook.created = new Date();

  createSheet(workbook, rows, kppnName, ckScore);

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
}

export default function useExcelWorksheetCK(params: ExcelWorksheetCKParams) {
  return { generate: () => generateExcelWorksheetCK(params) };
}

function createSheet(
  workbook: ExcelJS.Workbook,
  rows: WsCKJunctionType[],
  kppnName: string,
  ckScore: CKScoreType | null
) {
  const sheet = workbook.addWorksheet('Kertas Kerja CK', {
    views: [{ state: 'frozen', ySplit: 2 }],
  });
  sheet.columns = [
    { key: 'no', width: 7 },
    { key: 'materi', width: 31 },
    { key: 'kriteria', width: 35 },
    { key: 'bukti', width: 34 },
    { key: 'link', width: 34 },
    { key: 'nilaiKPPN', width: 14 },
    { key: 'konversiKPPN', width: 18 },
    { key: 'catatanKanwil', width: 40 },
    { key: 'separator', width: 3 },
    { key: 'nilaiKanwil', width: 14 },
    { key: 'konversiKanwil', width: 18 },
  ];

  addHeaderRows(sheet);

  const groups = new Map<number, WsCKJunctionType[]>();
  rows.forEach((row) => groups.set(row.komponen_ck_id, [...(groups.get(row.komponen_ck_id) || []), row]));
  let checklistNumber = 0;

  groups.forEach((componentRows) => {
    const component = componentRows[0];
    const sectionRow = sheet.addRow([
      formatOrderedTitle(component.komponen_urut, component.komponen_title),
    ]);
    sheet.mergeCells(`A${sectionRow.number}:K${sectionRow.number}`);
    for (let column = 1; column <= 11; column += 1) {
      const cell = sectionRow.getCell(column);
      cell.border = BORDER;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
      cell.font = { bold: true, name: 'Calibri', size: 11 };
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
    }
    sectionRow.height = 23;

    componentRows.forEach((junction) => {
      checklistNumber += 1;
      addChecklistRow(sheet, junction, kppnName, checklistNumber);
    });
  });

  addFooter(
    sheet,
    'Total Nilai',
    ckScore?.detailKPPN.totalSkorKonversi,
    ckScore?.detailKanwil.totalSkorKonversi,
    '0'
  );
  addFooter(
    sheet,
    'Rata-Rata Total Nilai',
    ckScore?.nilaiKPPN,
    ckScore?.nilaiKanwil,
    '0.00'
  );
  return sheet;
}

function addHeaderRows(sheet: ExcelJS.Worksheet) {
  const firstHeaderRow = sheet.addRow([
    'No',
    'Materi',
    'Kriteria Penilaian',
    'Bukti Dukung Kegiatan',
    'Link Bukti Dukung',
    'Berdasarkan Self Assessment KPPN',
    '',
    'Catatan Hasil Reviu Kanwil',
    '',
    'Berdasarkan Penilaian Kanwil DJPb',
    '',
  ]);
  const secondHeaderRow = sheet.addRow([
    '',
    '',
    '',
    '',
    '',
    'Nilai',
    'Nilai Konversi',
    '',
    '',
    'Nilai',
    'Nilai Konversi',
  ]);

  ['A', 'B', 'C', 'D', 'E', 'H', 'I'].forEach((column) => {
    sheet.mergeCells(`${column}1:${column}2`);
  });
  sheet.mergeCells('F1:G1');
  sheet.mergeCells('J1:K1');

  [firstHeaderRow, secondHeaderRow].forEach((row) => {
    row.height = 28;
    for (let column = 1; column <= 11; column += 1) {
      const cell = row.getCell(column);
      const isKPPNOrNote = column >= 6 && column <= 8;
      const isKanwil = column >= 10;
      const isSeparator = column === 9;
      const fillColor = isKPPNOrNote
        ? 'FFFFE699'
        : isKanwil
          ? 'FFC6E0B4'
          : isSeparator
            ? 'FFFFFFFF'
            : 'FFBFBFBF';
      const fontColor = isSeparator ? 'FF212121' : 'FF000000';

      cell.border = BORDER;
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
      cell.font = { bold: true, color: { argb: fontColor }, name: 'Calibri', size: 11 };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    }
  });
}

function addChecklistRow(
  sheet: ExcelJS.Worksheet,
  junction: WsCKJunctionType,
  kppnName: string,
  checklistNumber: number
) {
  const displayedKPPNScore = junction.excluded === 1 ? 'N/A' : junction.kppn_score ?? '';
  const convertedKPPNScore = junction.excluded === 1
    ? 'N/A'
    : junction.kppn_score == null
      ? ''
      : junction.kppn_score * 10;
  const displayedKanwilScore = junction.excluded === 1 ? 'N/A' : junction.kanwil_score ?? '';
  const convertedKanwilScore = junction.excluded === 1
    ? 'N/A'
    : junction.kanwil_score == null
      ? ''
      : junction.kanwil_score * 10;
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
    displayedKPPNScore,
    convertedKPPNScore,
    junction.kanwil_note || '',
    '',
    displayedKanwilScore,
    convertedKanwilScore,
  ]);

  for (let column = 1; column <= 11; column += 1) {
    const cell = row.getCell(column);
    cell.border = BORDER;
    cell.font = { name: 'Calibri', size: 10 };
    cell.alignment = {
      vertical: 'top',
      horizontal: [1, 6, 7, 9, 10, 11].includes(column) ? 'center' : 'left',
      wrapText: true,
    };
  }
  setEvidenceLinks(row, junction, kppnName, checklistNumber);
  row.height = estimateRowHeight(row);
}

function setEvidenceLinks(
  row: ExcelJS.Row,
  junction: WsCKJunctionType,
  kppnName: string,
  checklistNumber: number
) {
  const links: { url: string; suffix: string }[] = [];
  const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  const baseLabel = createEvidenceLabel(checklistNumber, kppnName);

  if (junction.file_1) {
    links.push({
      url: `${apiUrl}/worksheet/${junction.file_1}`,
      suffix: 'File_Server',
    });
  }
  if (junction.link_file?.trim()) {
    const external = junction.link_file.trim();
    links.push({
      url: /^https?:\/\//i.test(external) ? external : `https://${external}`,
      suffix: 'Link_Eksternal',
    });
  }

  const cell = row.getCell(5);
  const displayText = links.length === 1
    ? baseLabel
    : links.map((link) => `${baseLabel}_${link.suffix}`).join('\n\n');
  if (links.length === 1) {
    cell.value = { text: displayText, hyperlink: links[0].url, tooltip: links[0].url };
  } else if (links.length > 1) {
    cell.value = {
      text: displayText,
      hyperlink: links[0].url,
      tooltip: links.map((link) => link.url).join('\n\n'),
    };
  } else {
    cell.value = '';
  }
  if (links.length) {
    cell.font = { name: 'Calibri', size: 10, color: { argb: 'FF0563C1' }, underline: true };
  }
}

function estimateRowHeight(row: ExcelJS.Row) {
  const widths = [7, 31, 35, 34, 34, 14, 18, 40, 3, 14, 18];
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
  kppnValue: number | undefined,
  kanwilValue: number | undefined,
  numberFormat?: string
) {
  const row = sheet.addRow([
    label,
    '',
    '',
    '',
    '',
    '',
    kppnValue ?? null,
    '',
    '',
    '',
    kanwilValue ?? null,
  ]);
  sheet.mergeCells(`A${row.number}:F${row.number}`);
  for (let column = 1; column <= 11; column += 1) {
    const cell = row.getCell(column);
    cell.border = BORDER;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBFBFBF' } };
    cell.font = { bold: true, name: 'Calibri', size: 11 };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  }
  if (numberFormat) {
    row.getCell(7).numFmt = numberFormat;
    row.getCell(11).numFmt = numberFormat;
  }
  row.height = 24;
}

function createEvidenceLabel(checklistNumber: number, kppnName: string) {
  const normalizedKppnName = (kppnName || 'KPPN')
    .trim()
    .replace(/^KPPN[\s_-]*/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() || 'KPPN';
  const formattedNumber = String(checklistNumber).padStart(2, '0');

  return `CK${formattedNumber}_KPPN ${normalizedKppnName}`;
}

function safeFileName(value: string) {
  return value.replace(/[\\/:*?"<>|]/g, '_');
}

import ExcelJS from 'exceljs';
import {
  AspekSpmlRefType,
  KomponenSpmlRefType,
  SubKomponenSpmlRefType,
} from '../../hooks/useDictionary';
import { SPMLScoreType, WsSPMLJunctionType } from '../worksheetSPML/types';
import formatOrderedTitle from '../../utils/formatOrderedTitle';
import { formatNumberedListText } from '../../utils/formatNumberedList';

export interface ExcelWorksheetSPMLParams {
  rows: WsSPMLJunctionType[];
  kppnName: string;
  komponenRef: KomponenSpmlRefType[] | null;
  subKomponenRef: SubKomponenSpmlRefType[] | null;
  aspekRef: AspekSpmlRefType[] | null;
  spmlScore: SPMLScoreType | null;
}

const BORDER: Partial<ExcelJS.Borders> = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

export async function generateExcelWorksheetSPML({
  rows,
  kppnName,
  komponenRef,
  subKomponenRef,
  aspekRef,
  spmlScore,
}: ExcelWorksheetSPMLParams) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Salamaik Web';
  workbook.created = new Date();

  createScoreSheet(
    workbook,
    rows,
    komponenRef,
    subKomponenRef,
    aspekRef,
    kppnName,
    spmlScore
  );

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const objectUrl = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  const safeKppnName = (kppnName || 'KPPN').replace(/[\\/:*?"<>|]/g, '_');

  downloadLink.href = objectUrl;
  downloadLink.download = `Worksheet_SPML_${safeKppnName}_${Date.now()}.xlsx`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(objectUrl);
}

export default function useExcelWorksheetSPML(params: ExcelWorksheetSPMLParams) {
  return { generate: () => generateExcelWorksheetSPML(params) };
}

function createScoreSheet(
  workbook: ExcelJS.Workbook,
  rows: WsSPMLJunctionType[],
  komponenRef: KomponenSpmlRefType[] | null,
  subKomponenRef: SubKomponenSpmlRefType[] | null,
  aspekRef: AspekSpmlRefType[] | null,
  kppnName: string,
  spmlScore: SPMLScoreType | null
) {
  const sheet = workbook.addWorksheet('Kertas Kerja SPML', {
    views: [{ state: 'frozen', ySplit: 2 }],
  });

  sheet.columns = [
    { key: 'no', width: 8 },
    { key: 'aspek', width: 35 },
    { key: 'uraian', width: 60 },
    { key: 'buktiDukung', width: 50 },
    { key: 'linkBuktiDukung', width: 55 },
    { key: 'nilaiKPPN', width: 14 },
    { key: 'nilaiKonversiKPPN', width: 18 },
    { key: 'catatanKanwil', width: 45 },
    { key: 'separator', width: 3 },
    { key: 'nilaiKanwil', width: 14 },
    { key: 'nilaiKonversiKanwil', width: 18 },
  ];
  addHeaderRows(sheet);
  let checklistNumber = 0;

  komponenRef?.forEach((komponen) => {
    const komponenRows = rows.filter((item) => item.komponen_spml_id === komponen.id);
    if (komponenRows.length === 0) return;

    addSectionBandRow(sheet, formatOrderedTitle(komponen.urut, komponen.title), 'FFE0E0E0');

    subKomponenRef
      ?.filter((item) => item.komponen_spml_id === komponen.id)
      .forEach((subKomponen) => {
        const subKomponenRows = komponenRows.filter(
          (item) => item.subkomponen_spml_id === subKomponen.id
        );
        if (subKomponenRows.length === 0) return;

        addSectionBandRow(
          sheet,
          formatOrderedTitle(subKomponen.urut, subKomponen.title),
          'FFF5F5F5'
        );

        aspekRef
          ?.filter((item) => item.subkomponen_spml_id === subKomponen.id)
          .forEach((aspek) => {
            const aspekRows = subKomponenRows.filter((item) => item.aspek_spml_id === aspek.id);
            if (aspekRows.length === 0) return;

            const startRow = sheet.rowCount + 1;
            aspekRows.forEach((junction) => {
              checklistNumber += 1;
              addChecklistRow(
                sheet,
                junction,
                kppnName,
                checklistNumber
              );
            });
            const endRow = sheet.rowCount;

            sheet.getCell(`A${startRow}`).value = aspek.urut;
            sheet.getCell(`B${startRow}`).value = aspek.title;

            if (endRow > startRow) {
              sheet.mergeCells(`A${startRow}:A${endRow}`);
              sheet.mergeCells(`B${startRow}:B${endRow}`);
            }

            ['A', 'B'].forEach((column) => {
              sheet.getCell(`${column}${startRow}`).alignment = {
                vertical: 'middle',
                horizontal: column === 'A' ? 'center' : 'left',
                wrapText: true,
              };
            });
          });
      });
  });

  addFooterRow(
    sheet,
    'Total Nilai',
    spmlScore?.detailKPPN.totalSkorKonversi,
    spmlScore?.detailKanwil.totalSkorKonversi,
    'FFE0E0E0',
    'FF212121',
    '0'
  );
  addFooterRow(
    sheet,
    'Rata-Rata Total Nilai',
    spmlScore?.nilaiKPPN,
    spmlScore?.nilaiKanwil,
    'FF616161',
    'FFFFFFFF',
    '0.00'
  );

  return sheet;
}

function addHeaderRows(sheet: ExcelJS.Worksheet) {
  const firstHeaderRow = sheet.addRow([
    'No',
    'Aspek',
    'Uraian Kegiatan',
    'Bukti Dukung Kegiatan',
    'Link Bukti Dukung Kegiatan',
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
    for (let columnNumber = 1; columnNumber <= 11; columnNumber += 1) {
      const cell = row.getCell(columnNumber);
      const isKPPNOrNote = columnNumber >= 6 && columnNumber <= 8;
      const isKanwil = columnNumber >= 10;
      const isSeparator = columnNumber === 9;
      const fillColor = isKPPNOrNote
        ? 'FFFFE699'
        : isKanwil
          ? 'FFC6E0B4'
          : isSeparator
            ? 'FFFFFFFF'
            : 'FF616161';
      const fontColor = isKPPNOrNote || isKanwil || isSeparator
        ? 'FF212121'
        : 'FFFFFFFF';

      cell.font = { bold: true, color: { argb: fontColor }, name: 'Aptos' };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = BORDER;
    }
  });
}

function addSectionBandRow(sheet: ExcelJS.Worksheet, title: string, color: string) {
  const row = sheet.addRow([title]);
  row.height = 22;
  styleContinuousBand(row, 1, 11, color, { bold: true, name: 'Aptos' });
}

function addChecklistRow(
  sheet: ExcelJS.Worksheet,
  junction: WsSPMLJunctionType,
  kppnName: string,
  checklistNumber: number
) {
  const displayKPPNScore = junction.excluded === 1 ? 'N/A' : junction.kppn_score ?? '';
  const convertedKPPNScore = junction.excluded === 1
    ? 'N/A'
    : junction.kppn_score == null
      ? ''
      : junction.kppn_score * 10;
  const displayKanwilScore = junction.excluded === 1 ? 'N/A' : junction.kanwil_score ?? '';
  const convertedKanwilScore = junction.excluded === 1
    ? 'N/A'
    : junction.kanwil_score == null
      ? ''
      : junction.kanwil_score * 10;
  const formattedDescription = formatNumberedListText(junction.uraian);
  const row = sheet.addRow({
    uraian: formattedDescription,
    buktiDukung: junction.dokumen || '',
    nilaiKPPN: displayKPPNScore,
    nilaiKonversiKPPN: convertedKPPNScore,
    catatanKanwil: junction.kanwil_note || '',
    separator: '',
    nilaiKanwil: displayKanwilScore,
    nilaiKonversiKanwil: convertedKanwilScore,
  });

  row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
    cell.font = { name: 'Aptos', size: 10 };
    cell.border = BORDER;
    cell.alignment = {
      vertical: 'top',
      horizontal: [1, 6, 7, 9, 10, 11].includes(columnNumber) ? 'center' : 'left',
      wrapText: true,
    };
  });

  setLinkEvidenceCell(row, junction, kppnName, checklistNumber);
}

function setLinkEvidenceCell(
  row: ExcelJS.Row,
  junction: WsSPMLJunctionType,
  kppnName: string,
  checklistNumber: number
) {
  const cell = row.getCell(5);
  const links: { url: string; suffix: string }[] = [];
  const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  const baseLabel = createEvidenceLabel(checklistNumber, kppnName);

  cell.border = BORDER;

  if (junction.file_1) {
    links.push({
      url: `${apiUrl}/worksheet/${junction.file_1}`,
      suffix: 'File_Server',
    });
  }
  if (junction.link_file?.trim()) {
    const externalLink = junction.link_file.trim();
    links.push({
      url: /^https?:\/\//i.test(externalLink) ? externalLink : `https://${externalLink}`,
      suffix: 'Link_Eksternal',
    });
  }

  const displayText = links.length === 1
    ? baseLabel
    : links.map((link) => `${baseLabel}_${link.suffix}`).join('\n\n');
  cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };

  if (links.length === 1) {
    cell.value = { text: displayText, hyperlink: links[0].url, tooltip: links[0].url };
    cell.font = { name: 'Aptos', size: 10, color: { argb: 'FF0563C1' }, underline: true };
    return;
  }

  if (links.length > 1) {
    cell.value = {
      text: displayText,
      hyperlink: links[0].url,
      tooltip: links.map((link) => link.url).join('\n\n'),
    };
    cell.font = { name: 'Aptos', size: 10, color: { argb: 'FF0563C1' }, underline: true };
  }
}

function addFooterRow(
  sheet: ExcelJS.Worksheet,
  label: string,
  kppnValue: number | undefined,
  kanwilValue: number | undefined,
  fillColor: string,
  fontColor: string,
  numberFormat: string
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
  row.height = 24;

  for (let columnNumber = 1; columnNumber <= 11; columnNumber += 1) {
    const cell = row.getCell(columnNumber);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
    cell.border = BORDER;
    cell.font = { name: 'Aptos', bold: true, color: { argb: fontColor } };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
  }

  styleContinuousBand(row, 1, 6, fillColor, {
    name: 'Aptos',
    bold: true,
    color: { argb: fontColor },
  });

  row.getCell(7).numFmt = numberFormat;
  row.getCell(11).numFmt = numberFormat;
}

function styleContinuousBand(
  row: ExcelJS.Row,
  startColumn: number,
  endColumn: number,
  fillColor: string,
  font: Partial<ExcelJS.Font>
) {
  for (let columnNumber = startColumn; columnNumber <= endColumn; columnNumber += 1) {
    const cell = row.getCell(columnNumber);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
    cell.font = font;
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'centerContinuous',
      wrapText: true,
    };
    cell.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      ...(columnNumber === startColumn ? { left: { style: 'thin' as const } } : {}),
      ...(columnNumber === endColumn ? { right: { style: 'thin' as const } } : {}),
    };
  }
}

function createEvidenceLabel(checklistNumber: number, kppnName: string) {
  const normalizedKppnName = (kppnName || 'KPPN')
    .trim()
    .replace(/^KPPN[\s_-]+/i, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'KPPN';
  const formattedNumber = String(checklistNumber).padStart(2, '0');

  return `SPML${formattedNumber}_KPPN_${normalizedKppnName}`;
}

import ExcelJS from 'exceljs';
import {
  AspekSpmlRefType,
  KomponenSpmlRefType,
  SubKomponenSpmlRefType,
} from '../../hooks/useDictionary';
import { SPMLScoreType, WsSPMLJunctionType } from '../worksheetSPML/types';
import formatOrderedTitle from '../../utils/formatOrderedTitle';
import { formatNumberedListText } from '../../utils/formatNumberedList';

type ScoreType = 'kanwil' | 'kppn';

interface ExcelWorksheetSPMLParams {
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

export default function useExcelWorksheetSPML({
  rows,
  kppnName,
  komponenRef,
  subKomponenRef,
  aspekRef,
  spmlScore,
}: ExcelWorksheetSPMLParams) {
  const generate = async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Salamaik Web';
    workbook.created = new Date();

    createScoreSheet(
      workbook,
      'Nilai Versi Kanwil',
      'kanwil',
      rows,
      komponenRef,
      subKomponenRef,
      aspekRef,
      kppnName,
      spmlScore
    );
    createScoreSheet(
      workbook,
      'Nilai Versi KPPN',
      'kppn',
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
  };

  return { generate };
}

function createScoreSheet(
  workbook: ExcelJS.Workbook,
  sheetName: string,
  scoreType: ScoreType,
  rows: WsSPMLJunctionType[],
  komponenRef: KomponenSpmlRefType[] | null,
  subKomponenRef: SubKomponenSpmlRefType[] | null,
  aspekRef: AspekSpmlRefType[] | null,
  kppnName: string,
  spmlScore: SPMLScoreType | null
) {
  const sheet = workbook.addWorksheet(sheetName, {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  sheet.columns = [
    { key: 'no', header: 'No', width: 8 },
    { key: 'aspek', header: 'Aspek', width: 35 },
    { key: 'uraian', header: 'Uraian Kegiatan', width: 60 },
    { key: 'buktiDukung', header: 'Bukti Dukung Kegiatan', width: 50 },
    { key: 'linkBuktiDukung', header: 'Link Bukti Dukung Kegiatan', width: 55 },
    { key: 'nilai', header: 'Nilai', width: 12 },
    { key: 'nilaiKonversi', header: 'Nilai Konversi', width: 16 },
  ];
  styleHeader(sheet.getRow(1));
  let checklistNumber = 0;

  komponenRef?.forEach((komponen) => {
    const komponenRows = rows.filter((item) => item.komponen_spml_id === komponen.id);
    if (komponenRows.length === 0) return;

    addMergedSectionRow(sheet, formatOrderedTitle(komponen.urut, komponen.title), 'FFE0E0E0');

    subKomponenRef
      ?.filter((item) => item.komponen_spml_id === komponen.id)
      .forEach((subKomponen) => {
        const subKomponenRows = komponenRows.filter(
          (item) => item.subkomponen_spml_id === subKomponen.id
        );
        if (subKomponenRows.length === 0) return;

        addMergedSectionRow(
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
                scoreType,
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

  const totalScore = scoreType === 'kanwil'
    ? spmlScore?.detailKanwil.totalSkorKonversi
    : spmlScore?.detailKPPN.totalSkorKonversi;
  const worksheetScore = scoreType === 'kanwil'
    ? spmlScore?.nilaiKanwil
    : spmlScore?.nilaiKPPN;

  addFooterRow(sheet, 'Total Nilai', totalScore, 'FFE0E0E0', 'FF212121', '0');
  addFooterRow(
    sheet,
    'Rata-Rata Total Nilai',
    worksheetScore,
    'FF616161',
    'FFFFFFFF',
    '0.00'
  );

  return sheet;
}

function styleHeader(row: ExcelJS.Row) {
  row.height = 28;
  row.eachCell({ includeEmpty: true }, (cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Aptos' };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF616161' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = BORDER;
  });
}

function addMergedSectionRow(sheet: ExcelJS.Worksheet, title: string, color: string) {
  const row = sheet.addRow([title]);
  sheet.mergeCells(`A${row.number}:G${row.number}`);
  row.height = 22;

  for (let columnNumber = 1; columnNumber <= 7; columnNumber += 1) {
    const cell = row.getCell(columnNumber);
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
    cell.border = BORDER;
  }

  const titleCell = sheet.getCell(`A${row.number}`);
  titleCell.font = { bold: true, name: 'Aptos' };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
}

function addChecklistRow(
  sheet: ExcelJS.Worksheet,
  junction: WsSPMLJunctionType,
  scoreType: ScoreType,
  kppnName: string,
  checklistNumber: number
) {
  const score = scoreType === 'kanwil' ? junction.kanwil_score : junction.kppn_score;
  const displayScore = junction.excluded === 1 ? 'N/A' : score ?? '';
  const convertedScore = junction.excluded === 1 ? 'N/A' : score == null ? '' : score * 10;
  const formattedDescription = formatNumberedListText(junction.uraian);
  const row = sheet.addRow({
    uraian: formattedDescription,
    buktiDukung: junction.dokumen || '',
    nilai: displayScore,
    nilaiKonversi: convertedScore,
  });

  row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
    cell.font = { name: 'Aptos', size: 10 };
    cell.border = BORDER;
    cell.alignment = {
      vertical: 'top',
      horizontal: [1, 6, 7].includes(columnNumber) ? 'center' : 'left',
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
  value: number | undefined,
  fillColor: string,
  fontColor: string,
  numberFormat: string
) {
  const row = sheet.addRow([label, '', '', '', '', '', value ?? null]);
  sheet.mergeCells(`A${row.number}:F${row.number}`);
  row.height = 24;

  for (let columnNumber = 1; columnNumber <= 7; columnNumber += 1) {
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

  row.getCell(7).numFmt = numberFormat;
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

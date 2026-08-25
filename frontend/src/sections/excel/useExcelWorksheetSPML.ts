import ExcelJS from 'exceljs';
import {
  AspekSpmlRefType,
  KomponenSpmlRefType,
  SubKomponenSpmlRefType,
} from '../../hooks/useDictionary';
import { WsSPMLJunctionType } from '../worksheetSPML/types';
import formatOrderedTitle from '../../utils/formatOrderedTitle';

type ScoreType = 'kanwil' | 'kppn';

interface ExcelWorksheetSPMLParams {
  rows: WsSPMLJunctionType[];
  kppnName: string;
  komponenRef: KomponenSpmlRefType[] | null;
  subKomponenRef: SubKomponenSpmlRefType[] | null;
  aspekRef: AspekSpmlRefType[] | null;
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
}: ExcelWorksheetSPMLParams) {
  const generate = async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Salamaik Web';
    workbook.created = new Date();

    createScoreSheet(workbook, 'Nilai Kanwil', 'kanwil', rows, komponenRef, subKomponenRef, aspekRef);
    createScoreSheet(workbook, 'Nilai KPPN', 'kppn', rows, komponenRef, subKomponenRef, aspekRef);

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
  aspekRef: AspekSpmlRefType[] | null
) {
  const sheet = workbook.addWorksheet(sheetName, {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  sheet.columns = [
    { key: 'no', header: 'No', width: 8 },
    { key: 'aspek', header: 'Aspek', width: 35 },
    { key: 'kegiatan', header: 'Kegiatan', width: 75 },
    { key: 'nilai', header: 'Nilai', width: 12 },
    { key: 'dokumen', header: 'Dokumen', width: 65 },
  ];
  styleHeader(sheet.getRow(1));

  komponenRef?.forEach((komponen) => {
    const komponenRows = rows.filter((item) => item.komponen_spml_id === komponen.id);
    if (komponenRows.length === 0) return;

    addMergedSectionRow(sheet, formatOrderedTitle(komponen.urut, komponen.title), 'FFE8EEF7');

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
          'FFF4F6F8'
        );

        aspekRef
          ?.filter((item) => item.subkomponen_spml_id === subKomponen.id)
          .forEach((aspek) => {
            const aspekRows = subKomponenRows.filter((item) => item.aspek_spml_id === aspek.id);
            if (aspekRows.length === 0) return;

            const startRow = sheet.rowCount + 1;
            aspekRows.forEach((junction) => addChecklistRow(sheet, junction, scoreType));
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

  return sheet;
}

function styleHeader(row: ExcelJS.Row) {
  row.height = 28;
  row.eachCell({ includeEmpty: true }, (cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Aptos' };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2065D1' } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = BORDER;
  });
}

function addMergedSectionRow(sheet: ExcelJS.Worksheet, title: string, color: string) {
  const row = sheet.addRow([title]);
  sheet.mergeCells(`A${row.number}:E${row.number}`);
  row.height = 22;

  row.eachCell({ includeEmpty: true }, (cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
    cell.border = BORDER;
  });

  const titleCell = sheet.getCell(`A${row.number}`);
  titleCell.font = { bold: true, name: 'Aptos' };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
}

function addChecklistRow(
  sheet: ExcelJS.Worksheet,
  junction: WsSPMLJunctionType,
  scoreType: ScoreType
) {
  const score = scoreType === 'kanwil' ? junction.kanwil_score : junction.kppn_score;
  const row = sheet.addRow({
    kegiatan: junction.uraian,
    nilai: junction.excluded === 1 ? 'N/A' : score ?? '',
  });
  row.height = 55;

  row.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
    cell.font = { name: 'Aptos', size: 10 };
    cell.border = BORDER;
    cell.alignment = {
      vertical: 'top',
      horizontal: columnNumber === 4 ? 'center' : 'left',
      wrapText: true,
    };
  });

  setDocumentCell(row, junction);
}

function setDocumentCell(row: ExcelJS.Row, junction: WsSPMLJunctionType) {
  const cell = row.getCell(5);
  const urls: string[] = [];
  const apiUrl = import.meta.env.VITE_API_URL.replace(/\/+$/, '');

  cell.border = BORDER;

  if (junction.file_1) {
    urls.push(`${apiUrl}/worksheet/${junction.file_1}`);
  }
  if (junction.link_file?.trim()) {
    const externalLink = junction.link_file.trim();
    urls.push(/^https?:\/\//i.test(externalLink) ? externalLink : `https://${externalLink}`);
  }

  const displayText = urls.map(formatUrlForDisplay).join('\n\n');
  const displayedLines = displayText ? displayText.split('\n').length : 1;
  row.height = Math.max(row.height || 55, displayedLines * 15);
  cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };

  if (urls.length === 1) {
    cell.value = { text: displayText, hyperlink: urls[0], tooltip: urls[0] };
    cell.font = { name: 'Aptos', size: 10, color: { argb: 'FF0563C1' }, underline: true };
    return;
  }

  if (urls.length > 1) {
    cell.value = { text: displayText, hyperlink: urls[0], tooltip: urls.join('\n\n') };
    cell.font = { name: 'Aptos', size: 10, color: { argb: 'FF0563C1' }, underline: true };
  }
}

function formatUrlForDisplay(url: string) {
  return url.match(/.{1,45}/g)?.join('\n') || url;
}

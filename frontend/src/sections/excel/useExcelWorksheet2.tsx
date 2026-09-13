import ExcelJS from 'exceljs';
import { PBScoreType, WsJunctionType } from '../worksheet/types';

interface KomponenRefType {
  id: number;
  title: string;
  bobot: number;
  detail?: string;
  alias?: string;
}

interface SubKomponenRefType {
  id: number;
  komponen_id: number;
  title: string;
  detail?: string;
  alias?: string;
}

const COLUMN_COUNT = 13;
const HEADER_FILL = 'FFBFBFBF';
const SECTION_FILL = 'FFD9D9D9';
const KPPN_FILL = 'FFFFF2CC';
const KANWIL_FILL = 'FFE2F0D9';

const thinBorder: Partial<ExcelJS.Borders> = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

export default function useExcelWorksheet2(
  checklist: WsJunctionType[],
  kppnName: string,
  pbScore: PBScoreType,
  komponenRef: KomponenRefType[] | null,
  subKomponenRef: SubKomponenRefType[] | null
) {
  const generate = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('KK_Proses Bisnis', {
        views: [{ state: 'frozen', ySplit: 2 }],
        pageSetup: {
          orientation: 'landscape',
          fitToPage: true,
          fitToWidth: 1,
          fitToHeight: 0,
          paperSize: 9,
        },
      });

      configureColumns(sheet);
      createHeader(sheet);

      komponenRef?.forEach((komponen) => {
        addSectionRow(sheet, komponen.title, true);

        subKomponenRef
          ?.filter((item) => item.komponen_id === komponen.id)
          .forEach((subKomponen) => {
            addSectionRow(sheet, subKomponen.title);

            checklist
              .filter((item) => item.subkomponen_id === subKomponen.id)
              .sort((left, right) => (left.urut ?? 0) - (right.urut ?? 0))
              .forEach((item) => addChecklistRow(sheet, item));
          });
      });

      addScoreFooter(sheet, pbScore);

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);

      link.href = objectUrl;
      link.download = `Kertas_Kerja_PB_${kppnName}_${new Date().getTime()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error(error);
    }
  };

  return { generate };
}

function configureColumns(sheet: ExcelJS.Worksheet) {
  sheet.columns = [
    { key: 'no', width: 4 },
    { key: 'title', width: 21 },
    { key: 'kriteria_penilaian', width: 52 },
    { key: 'critical_point', width: 39 },
    { key: 'dasar_hukum', width: 53 },
    { key: 'contoh_file', width: 34 },
    { key: 'link_file', width: 52 },
    { key: 'kppn_score', width: 21 },
    { key: 'kppn_conversion', width: 9 },
    { key: 'kanwil_note', width: 40 },
    { key: 'separator', width: 3 },
    { key: 'kanwil_score', width: 22 },
    { key: 'kanwil_conversion', width: 9 },
  ];
}

function createHeader(sheet: ExcelJS.Worksheet) {
  sheet.mergeCells('A1:A2');
  sheet.mergeCells('B1:B2');
  sheet.mergeCells('C1:C2');
  sheet.mergeCells('D1:D2');
  sheet.mergeCells('E1:E2');
  sheet.mergeCells('F1:F2');
  sheet.mergeCells('G1:G2');
  sheet.mergeCells('H1:I1');
  sheet.mergeCells('J1:J2');
  sheet.mergeCells('K1:K2');
  sheet.mergeCells('L1:M1');

  sheet.getCell('A1').value = 'No';
  sheet.getCell('B1').value = 'Materi';
  sheet.getCell('C1').value = 'Kriteria Penilaian';
  sheet.getCell('D1').value = 'Critical Point';
  sheet.getCell('E1').value = 'Dasar Hukum';
  sheet.getCell('F1').value = 'Bukti Dukung';
  sheet.getCell('G1').value = 'Link Bukti Dukung';
  sheet.getCell('H1').value = 'Berdasarkan Self Assessment KPPN';
  sheet.getCell('H2').value = 'Nilai\n*jika tidak mempunyai transaksi maka kolom diisi N/A';
  sheet.getCell('I2').value = 'Nilai Konversi';
  sheet.getCell('J1').value = 'Catatan Hasil Reviu Kanwil';
  sheet.getCell('L1').value = 'Berdasarkan Penilaian Kanwil DJPb';
  sheet.getCell('L2').value = 'Nilai\n*jika tidak mempunyai transaksi maka kolom diisi N/A';
  sheet.getCell('M2').value = 'Nilai Konversi';

  sheet.getRow(1).height = 32;
  sheet.getRow(2).height = 65;

  for (let rowNumber = 1; rowNumber <= 2; rowNumber += 1) {
    for (let columnNumber = 1; columnNumber <= COLUMN_COUNT; columnNumber += 1) {
      const cell = sheet.getCell(rowNumber, columnNumber);
      cell.font = { bold: true, name: 'Aptos Narrow', size: 11 };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.fill = solidFill(HEADER_FILL);
      cell.border = thinBorder;
    }
  }

  ['H1', 'H2', 'I2', 'J1'].forEach((address) => {
    sheet.getCell(address).fill = solidFill(KPPN_FILL);
  });
  ['L1', 'L2', 'M2'].forEach((address) => {
    sheet.getCell(address).fill = solidFill(KANWIL_FILL);
  });
}

function addSectionRow(sheet: ExcelJS.Worksheet, title: string, bold = false) {
  const row = sheet.addRow([title]);
  styleContinuousBand(row, 1, COLUMN_COUNT, SECTION_FILL, {
    bold: true,
    name: 'Aptos Narrow',
    size: bold ? 11 : 10,
  });
  row.height = 21;
}

function addChecklistRow(sheet: ExcelJS.Worksheet, row: WsJunctionType) {
  const isStandardisasi = row.standardisasi === 1;
  const opsiText = !isStandardisasi
    ? row.opsi?.map((item) => `- Nilai ${item.value}\n${item.title}`).join('\n\n') || ''
    : '';
  const kriteriaText = [row.header || '', opsiText].filter(Boolean).join('\n\n');
  const excluded = row.excluded === 1;

  const addedRow = sheet.addRow({
    no: row.urut ?? '',
    title: row.title || '',
    kriteria_penilaian: kriteriaText,
    critical_point: row.critical_point || '',
    dasar_hukum: row.peraturan || '',
    contoh_file: row.contoh_file || '',
    link_file: row.link_file || '',
    kppn_score: excluded ? 'N/A' : row.kppn_score ?? '',
    kppn_conversion: excluded ? 'N/A' : convertScore(row.kppn_score),
    kanwil_note: row.kanwil_note || '',
    separator: '',
    kanwil_score: excluded ? 'N/A' : row.kanwil_score ?? '',
    kanwil_conversion: excluded ? 'N/A' : convertScore(row.kanwil_score),
  });

  addedRow.height = estimateRowHeight(addedRow);
  addedRow.eachCell({ includeEmpty: true }, (cell, columnNumber) => {
    cell.font = { name: 'Aptos Narrow', size: 10 };
    cell.alignment = {
      vertical: 'top',
      horizontal: [1, 8, 9, 12, 13].includes(columnNumber) ? 'center' : 'left',
      wrapText: true,
    };
    cell.border = thinBorder;

    if ([8, 9, 10].includes(columnNumber)) cell.fill = solidFill(KPPN_FILL);
    if ([12, 13].includes(columnNumber)) cell.fill = solidFill(KANWIL_FILL);
  });
}

function addScoreFooter(
  sheet: ExcelJS.Worksheet,
  pbScore: PBScoreType
) {
  const totalKPPN = pbScore.detailKPPN.totalSkorKonversi;
  const totalKanwil = pbScore.detailKanwil.totalSkorKonversi;

  const totalRow = sheet.addRow([
    '', '', '', '', '', '', '', 'TOTAL NILAI KONVERSI', totalKPPN, '', '', 'TOTAL NILAI KONVERSI', totalKanwil,
  ]);
  const finalRow = sheet.addRow([
    'RATA-RATA TOTAL NILAI', '', '', '', '', '', '', '', pbScore.nilaiKPPN, '', '',
    'RATA-RATA TOTAL NILAI', pbScore.nilaiKanwil,
  ]);

  [totalRow, finalRow].forEach((row) => {
    row.height = 25;
    for (let columnNumber = 1; columnNumber <= COLUMN_COUNT; columnNumber += 1) {
      const cell = row.getCell(columnNumber);
      cell.font = { bold: true, name: 'Aptos Narrow', size: 10 };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = thinBorder;
    }
  });

  styleContinuousBand(finalRow, 1, 8, SECTION_FILL, {
    bold: true,
    name: 'Aptos Narrow',
    size: 10,
  });

  ['H', 'I', 'J'].forEach((column) => {
    sheet.getCell(`${column}${totalRow.number}`).fill = solidFill(KPPN_FILL);
  });
  ['I', 'J'].forEach((column) => {
    sheet.getCell(`${column}${finalRow.number}`).fill = solidFill(KPPN_FILL);
  });
  ['L', 'M'].forEach((column) => {
    sheet.getCell(`${column}${totalRow.number}`).fill = solidFill(KANWIL_FILL);
    sheet.getCell(`${column}${finalRow.number}`).fill = solidFill(KANWIL_FILL);
  });

  sheet.getCell(`I${finalRow.number}`).numFmt = '0.00';
  sheet.getCell(`M${finalRow.number}`).numFmt = '0.00';
}

function convertScore(score: number | null) {
  return score === null ? '' : score * 10;
}

function estimateRowHeight(row: ExcelJS.Row) {
  let maxLines = 1;

  row.eachCell({ includeEmpty: true }, (cell) => {
    const value = typeof cell.value === 'string' ? cell.value : '';
    const explicitLines = value.split(/\r?\n/).length;
    const wrappedLines = Math.ceil(value.length / 55);
    maxLines = Math.max(maxLines, explicitLines, wrappedLines);
  });

  return Math.min(Math.max(maxLines * 13, 25), 170);
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
    cell.fill = solidFill(fillColor);
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

function solidFill(argb: string): ExcelJS.Fill {
  return {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb },
  };
}

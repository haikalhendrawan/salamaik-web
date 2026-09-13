import ExcelJS from 'exceljs';
import {
  AKKComponentDetail,
  AKKScoreResponse,
  AKKSideDetail,
  PBScoreDetail,
} from './types';

type ExcelPenilaianParams = {
  data: AKKScoreResponse;
};

const COLORS = {
  header: 'FFBFBFBF',
  selfAssessment: 'FFBDD7EE',
  kanwil: 'FFFFFF00',
  text: 'FF000000',
} as const;

const BORDER: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: 'FF808080' } },
  left: { style: 'thin', color: { argb: 'FF808080' } },
  bottom: { style: 'thin', color: { argb: 'FF808080' } },
  right: { style: 'thin', color: { argb: 'FF808080' } },
};

export default function useExcelPenilaian(params: ExcelPenilaianParams) {
  return {
    generate: () => generateExcelPenilaian(params),
  };
}

export async function generateExcelPenilaian({ data }: ExcelPenilaianParams) {
  if (data.peraturan === 1) {
    await generateExcelPenilaianPeraturan1(data);
    return;
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Salamaik Web';
  workbook.created = new Date();
  workbook.subject = `Nilai Aspek Kinerja ${data.kppnName} - ${data.periodName}`;

  const worksheet = workbook.addWorksheet('REKAP', {
    views: [{ showGridLines: false }],
    pageSetup: {
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      paperSize: 9,
    },
  });

  worksheet.columns = [
    { key: 'kppnName', width: 15.14 },
    { key: 'nilaiKKPB', width: 22.29 },
    { key: 'bobotPB', width: 13 },
    { key: 'nilaiPB', width: 13 },
    { key: 'nilaiKKSPML', width: 22.14 },
    { key: 'bobotSPML', width: 12.57 },
    { key: 'nilaiSPML', width: 14.43 },
    { key: 'nilaiKKCK', width: 20.86 },
    { key: 'bobotCK', width: 11 },
    { key: 'nilaiCK', width: 9.71 },
    { key: 'nilaiAKK', width: 10.86 },
  ];

  addTitle(worksheet, data.kppnAlias || data.kppnName);
  worksheet.addRow([]).height = 8;
  addHeaders(worksheet, data.detailKPPN);
  addSection(worksheet, 'Berdasarkan self assessment KPPN', COLORS.selfAssessment);
  addScoreRow(
    worksheet,
    data.kppnAlias || data.kppnName,
    data.detailKPPN,
    data.nilaiKPPN,
    COLORS.selfAssessment
  );
  worksheet.addRow([]).height = 8;
  addSection(worksheet, 'Berdasarkan penilaian Kanwil', COLORS.kanwil);
  addScoreRow(
    worksheet,
    data.kppnAlias || data.kppnName,
    data.detailKanwil,
    data.nilaiKanwil,
    COLORS.kanwil
  );

  worksheet.pageSetup.printArea = `A1:K${worksheet.lastRow?.number || 1}`;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Penilaian_AKK_${safeFileName(data.kppnAlias || data.kppnName)}_${safeFileName(data.periodName)}_${Date.now()}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function generateExcelPenilaianPeraturan1(data: AKKScoreResponse) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Salamaik Web';
  workbook.created = new Date();
  workbook.subject = `Rekapitulasi Penilaian ${data.kppnName} - ${data.periodName}`;

  const worksheet = workbook.addWorksheet('REKAP PB', {
    views: [{ showGridLines: false }],
    pageSetup: {
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      paperSize: 9,
    },
  });
  worksheet.columns = [
    { width: 7 },
    { width: 38 },
    { width: 16 },
    { width: 18 },
    { width: 18 },
    { width: 15 },
    { width: 18 },
  ];

  const title = worksheet.addRow([
    `REKAPITULASI PENILAIAN KINERJA ${(data.kppnAlias || data.kppnName).toUpperCase()}`,
  ]);
  worksheet.mergeCells(`A${title.number}:G${title.number}`);
  title.height = 26;
  stylePBRow(title, COLORS.header, true);

  addPBSection(
    worksheet,
    'Berdasarkan Self Assessment KPPN',
    data.detailPBKPPN,
    data.nilaiKPPN,
    COLORS.selfAssessment
  );
  worksheet.addRow([]).height = 8;
  addPBSection(
    worksheet,
    'Berdasarkan Penilaian Kanwil',
    data.detailPBKanwil,
    data.nilaiKanwil,
    COLORS.kanwil
  );

  worksheet.pageSetup.printArea = `A1:G${worksheet.lastRow?.number || 1}`;
  await downloadWorkbook(
    workbook,
    `Penilaian_AKK_${safeFileName(data.kppnAlias || data.kppnName)}_${safeFileName(data.periodName)}_${Date.now()}.xlsx`
  );
}

function addPBSection(
  worksheet: ExcelJS.Worksheet,
  title: string,
  detail: PBScoreDetail,
  finalScore: number,
  fillColor: string
) {
  const section = worksheet.addRow([title]);
  worksheet.mergeCells(`A${section.number}:G${section.number}`);
  section.height = 23;
  stylePBRow(section, fillColor, true);

  const header = worksheet.addRow([
    'No',
    'Nama Komponen',
    'Total Nilai',
    'Bilangan Pembagi',
    'Rata-Rata Nilai',
    'Bobot Nilai',
    'Nilai Tertimbang',
  ]);
  header.height = 30;
  stylePBRow(header, COLORS.header, true);

  detail.detailKomponen.forEach((component, index) => {
    const row = worksheet.addRow([
      index + 1,
      component.komponenTitle,
      component.totalSkorKonversi,
      component.jumlahChecklistPembagi,
      component.nilaiRataRata,
      component.komponenBobot / 100,
      component.nilaiTerbobot,
    ]);
    row.height = 23;
    stylePBRow(row, fillColor, false);
    [3, 5, 7].forEach((column) => { row.getCell(column).numFmt = '0.00'; });
    row.getCell(6).numFmt = '0.00%';
  });

  const footer = worksheet.addRow(['Nilai Akhir', '', '', '', '', '', finalScore]);
  worksheet.mergeCells(`A${footer.number}:F${footer.number}`);
  footer.height = 24;
  stylePBRow(footer, COLORS.kanwil, true);
  footer.getCell(7).numFmt = '0.00';
}

function stylePBRow(row: ExcelJS.Row, fillColor: string, bold: boolean) {
  for (let column = 1; column <= 7; column += 1) {
    const cell = row.getCell(column);
    cell.border = BORDER;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
    cell.font = { name: 'Calibri', size: 11, bold, color: { argb: COLORS.text } };
    cell.alignment = {
      horizontal: column === 2 && !bold ? 'left' : 'center',
      vertical: 'middle',
      wrapText: true,
    };
  }
}

async function downloadWorkbook(workbook: ExcelJS.Workbook, fileName: string) {
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function addTitle(worksheet: ExcelJS.Worksheet, kppnName: string) {
  const displayName = /^KPPN\b/i.test(kppnName.trim()) ? kppnName.trim() : `KPPN ${kppnName.trim()}`;
  const row = worksheet.addRow([`PENILAIAN ASPEK KINERJA ${displayName.toUpperCase()}`]);
  worksheet.mergeCells(`A${row.number}:K${row.number}`);
  row.height = 24;
  row.getCell(1).font = { name: 'Calibri', size: 11, bold: true, color: { argb: COLORS.text } };
  row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
}

function addHeaders(worksheet: ExcelJS.Worksheet, detail: AKKSideDetail) {
  const firstRow = worksheet.addRow([
    'Nama KPPN',
    'Penilaian Aspek Kinerja KPPN',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  const secondRow = worksheet.addRow([
    '',
    componentTitle('Proses Bisnis (PB)', detail.pb),
    '',
    '',
    componentTitle('Sarana dan Prasarana Mutu Layanan', detail.spml),
    '',
    '',
    componentTitle('Capaian Kinerja', detail.ck),
    '',
    '',
    'AKK KPPN',
  ]);
  const thirdRow = worksheet.addRow([
    '',
    'Nilai Kertas Kerja PB',
    'Bobot PB',
    'Nilai PB',
    'Nilai Kertas Kerja SPML',
    'Bobot SPML',
    'Nilai SPML',
    'Nilai Kertas Kerja CK',
    'Bobot CK',
    'Nilai CK',
    '',
  ]);

  worksheet.mergeCells(`A${firstRow.number}:A${thirdRow.number}`);
  worksheet.mergeCells(`B${firstRow.number}:K${firstRow.number}`);
  worksheet.mergeCells(`B${secondRow.number}:D${secondRow.number}`);
  worksheet.mergeCells(`E${secondRow.number}:G${secondRow.number}`);
  worksheet.mergeCells(`H${secondRow.number}:J${secondRow.number}`);
  worksheet.mergeCells(`K${secondRow.number}:K${thirdRow.number}`);

  [firstRow, secondRow, thirdRow].forEach((row) => {
    row.height = 28;
    styleRow(row, COLORS.header, true);
  });
}

function addSection(worksheet: ExcelJS.Worksheet, title: string, fillColor: string) {
  const row = worksheet.addRow([title]);
  worksheet.mergeCells(`A${row.number}:K${row.number}`);
  row.height = 23;
  styleRow(row, fillColor, true);
}

function addScoreRow(
  worksheet: ExcelJS.Worksheet,
  kppnName: string,
  detail: AKKSideDetail,
  nilaiAKK: number,
  fillColor: string
) {
  const row = worksheet.addRow([
    kppnName,
    detail.pb.nilai,
    detail.pb.bobot / 100,
    detail.pb.kontribusi,
    detail.spml?.nilai ?? '-',
    detail.spml ? detail.spml.bobot / 100 : '-',
    detail.spml?.kontribusi ?? '-',
    detail.ck?.nilai ?? '-',
    detail.ck ? detail.ck.bobot / 100 : '-',
    detail.ck?.kontribusi ?? '-',
    nilaiAKK,
  ]);

  row.height = 22;
  styleRow(row, fillColor, false);
  [2, 4, 5, 7, 8, 10, 11].forEach((column) => {
    if (typeof row.getCell(column).value === 'number') row.getCell(column).numFmt = '0.00';
  });
  [3, 6, 9].forEach((column) => {
    if (typeof row.getCell(column).value === 'number') row.getCell(column).numFmt = '0%';
  });
  row.getCell(1).font = { name: 'Calibri', size: 11, bold: true, color: { argb: COLORS.text } };
}

function componentTitle(title: string, detail: AKKComponentDetail | null) {
  return detail ? `${title} (${formatWeight(detail.bobot)})` : `${title} (Tidak berlaku)`;
}

function formatWeight(value: number) {
  return `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(value)}%`;
}

function styleRow(row: ExcelJS.Row, fillColor: string, bold: boolean) {
  for (let column = 1; column <= 11; column += 1) {
    const cell = row.getCell(column);
    cell.border = BORDER;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
    cell.font = { name: 'Calibri', size: 11, bold, color: { argb: COLORS.text } };
    cell.alignment = {
      horizontal: column === 1 && !bold ? 'left' : 'center',
      vertical: 'middle',
      wrapText: true,
    };
  }
}

function safeFileName(value: string) {
  return value.trim().replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, '_');
}

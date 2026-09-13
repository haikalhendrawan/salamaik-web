import ExcelJS from 'exceljs';
import {
  AKKComponentDetail,
  AKKContributorCategory,
  AKKContributorGroup,
  AKKContributorLHPSResponse,
} from './types';

const CATEGORY_CODES: Record<AKKContributorCategory, string> = {
  A1_PROVINSI: 'A',
  A1_NON_PROVINSI: 'B',
  A2: 'C',
  SELURUH_KPPN: 'A',
};

const COLORS = {
  header: 'FF404040',
  group: 'FF666666',
  subtotal: 'FFE7E6E6',
  score: 'FFFFE699',
  white: 'FFFFFFFF',
  black: 'FF000000',
  border: 'FF808080',
} as const;

const BORDER: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: COLORS.border } },
  left: { style: 'thin', color: { argb: COLORS.border } },
  bottom: { style: 'thin', color: { argb: COLORS.border } },
  right: { style: 'thin', color: { argb: COLORS.border } },
};

export default function useExcelNilaiAKKPenyumbangLHPS(data: AKKContributorLHPSResponse) {
  return {
    generate: () => generateExcel(data),
  };
}

async function generateExcel(data: AKKContributorLHPSResponse) {
  if (data.peraturan === 1) {
    await generateExcelPeraturan1(data);
    return;
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Salamaik Web';
  workbook.created = new Date();
  workbook.subject = `Nilai AKK Penyumbang Nilai LHPS - ${data.periodName}`;

  const worksheet = workbook.addWorksheet('NILAI AKK LHPS', {
    views: [{ showGridLines: false, state: 'frozen', ySplit: 3 }],
    pageSetup: {
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      paperSize: 9,
    },
  });

  worksheet.columns = [
    { width: 7 }, { width: 25 }, { width: 13 }, { width: 20 }, { width: 11 },
    { width: 12 }, { width: 21 }, { width: 12 }, { width: 13 }, { width: 20 },
    { width: 11 }, { width: 12 }, { width: 12 }, { width: 15 }, { width: 25 },
  ];

  addHeaders(worksheet, data);
  data.kelompok.forEach((group) => addGroup(worksheet, group));
  addFooter(worksheet, data);
  worksheet.pageSetup.printArea = `A1:O${worksheet.lastRow?.number || 1}`;

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Nilai_AKK_Penyumbang_LHPS_${safeFileName(data.periodName)}_${Date.now()}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function generateExcelPeraturan1(data: AKKContributorLHPSResponse) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Salamaik Web';
  workbook.created = new Date();
  workbook.subject = `Nilai AKK Penyumbang Nilai LHPS - ${data.periodName}`;

  const worksheet = workbook.addWorksheet('NILAI AKK LHPS', {
    views: [{ showGridLines: false, state: 'frozen', ySplit: 2 }],
    pageSetup: {
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      paperSize: 9,
    },
  });
  const units = data.kelompok.flatMap((group) => group.kppn);
  const components = units[0]?.detailKomponenPB ?? [];
  const lastColumn = components.length + 3;

  worksheet.columns = [
    { width: 7 },
    { width: 25 },
    ...components.map(() => ({ width: 22 })),
    { width: 24 },
  ];

  const title = worksheet.addRow([
    'NILAI PEMBINAAN KPPN',
  ]);
  worksheet.mergeCells(title.number, 1, title.number, lastColumn);
  title.height = 28;
  styleDynamicRow(title, lastColumn, COLORS.header, COLORS.white, true);

  const header = worksheet.addRow([
    'No',
    'KPPN',
    ...components.map((component) => (
      `${component.komponenTitle} (${component.komponenBobot}%)`
    )),
    'Jumlah Setelah Dibobotkan',
  ]);
  header.height = 40;
  styleDynamicRow(header, lastColumn, COLORS.header, COLORS.white, true);

  units.forEach((unit, index) => {
    const row = worksheet.addRow([
      index + 1,
      unit.alias || unit.name,
      ...components.map((component) => (
        unit.detailKomponenPB.find((item) => item.komponenId === component.komponenId)
          ?.nilaiTerbobot ?? '-'
      )),
      unit.nilaiAKK,
    ]);
    row.height = 23;
    styleDynamicRow(row, lastColumn, COLORS.white, COLORS.black, false);
    for (let column = 3; column <= lastColumn; column += 1) {
      if (typeof row.getCell(column).value === 'number') row.getCell(column).numFmt = '0.00';
    }
  });

  addDynamicFooter(
    worksheet,
    lastColumn,
    'Total Nilai Seluruh KPPN',
    data.totalNilaiKPPN,
    '0.00'
  );
  addDynamicFooter(
    worksheet,
    lastColumn,
    'Jumlah KPPN (Bilangan Pembagi)',
    data.jumlahPembagi,
    '0'
  );

  const finalRow = worksheet.addRow([
    'NILAI PEMBINAAN KPPN LINGKUP KANWIL DJPb PROVINSI SUMATERA BARAT',
  ]);
  finalRow.getCell(lastColumn).value = data.nilaiAkhirAspekKinerja;
  worksheet.mergeCells(finalRow.number, 1, finalRow.number, lastColumn - 1);
  finalRow.height = 34;
  styleDynamicRow(finalRow, lastColumn, COLORS.header, COLORS.white, true);
  finalRow.getCell(lastColumn).fill = {
    type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.score },
  };
  finalRow.getCell(lastColumn).font = {
    name: 'Calibri', size: 15, bold: true, color: { argb: COLORS.black },
  };
  finalRow.getCell(lastColumn).numFmt = '0.00';

  worksheet.pageSetup.printArea = `A1:${worksheet.getColumn(lastColumn).letter}${finalRow.number}`;
  await downloadWorkbook(
    workbook,
    `Nilai_AKK_Penyumbang_LHPS_${safeFileName(data.periodName)}_${Date.now()}.xlsx`
  );
}

function addDynamicFooter(
  worksheet: ExcelJS.Worksheet,
  lastColumn: number,
  label: string,
  value: number,
  numberFormat: string
) {
  const row = worksheet.addRow([label]);
  row.getCell(lastColumn).value = value;
  worksheet.mergeCells(row.number, 1, row.number, lastColumn - 1);
  row.height = 24;
  styleDynamicRow(row, lastColumn, COLORS.group, COLORS.white, true);
  row.getCell(lastColumn).numFmt = numberFormat;
}

function styleDynamicRow(
  row: ExcelJS.Row,
  lastColumn: number,
  fillColor: string,
  textColor: string,
  bold: boolean
) {
  for (let column = 1; column <= lastColumn; column += 1) {
    const cell = row.getCell(column);
    cell.border = BORDER;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
    cell.font = { name: 'Calibri', size: 10, bold, color: { argb: textColor } };
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

function addHeaders(worksheet: ExcelJS.Worksheet, data: AKKContributorLHPSResponse) {
  const firstUnit = data.kelompok.flatMap((group) => group.kppn)[0];
  const pbWeight = firstUnit?.pb.bobot ?? (data.peraturan === 1 ? 100 : 50);
  const spmlWeight = firstUnit?.spml?.bobot ?? null;
  const ckWeight = firstUnit?.ck?.bobot ?? null;
  const first = worksheet.addRow([
    'No', 'KPPN', 'Bobot KPPN', 'Penilaian Aspek Kinerja KPPN',
    '', '', '', '', '', '', '', '', '', 'AKK Penyumbang Nilai LHPS', '',
  ]);
  const second = worksheet.addRow([
    '', '', '',
    `Proses Bisnis (PB) (${formatHeaderWeight(pbWeight)})`, '', '',
    `Sarana dan Prasarana Mutu Layanan (${formatHeaderWeight(spmlWeight)})`, '', '',
    `Capaian Kinerja (${formatHeaderWeight(ckWeight)})`, '', '',
    'Nilai AKK', 'Bobot Memenuhi', 'Hasil AKK Penyumbang Nilai LHPS',
  ]);
  const third = worksheet.addRow([
    '', '', '',
    'Nilai Kertas Kerja PB', 'Bobot PB', 'Nilai PB',
    'Nilai Kertas Kerja SPML', 'Bobot SPML', 'Nilai SPML',
    'Nilai Kertas Kerja CK', 'Bobot CK', 'Nilai CK', '', '', '',
  ]);

  worksheet.mergeCells('A1:A3');
  worksheet.mergeCells('B1:B3');
  worksheet.mergeCells('C1:C3');
  worksheet.mergeCells('D1:M1');
  worksheet.mergeCells('N1:O1');
  worksheet.mergeCells('D2:F2');
  worksheet.mergeCells('G2:I2');
  worksheet.mergeCells('J2:L2');
  worksheet.mergeCells('M2:M3');
  worksheet.mergeCells('N2:N3');
  worksheet.mergeCells('O2:O3');

  [first, second, third].forEach((row) => {
    row.height = 30;
    styleRange(row, COLORS.header, COLORS.white, true);
  });
}

function addGroup(worksheet: ExcelJS.Worksheet, group: AKKContributorGroup) {
  const groupRow = worksheet.addRow([
    CATEGORY_CODES[group.kategori],
    group.label,
    group.bobot / 100,
  ]);
  worksheet.mergeCells(`D${groupRow.number}:O${groupRow.number}`);
  groupRow.height = 23;
  styleRange(groupRow, COLORS.group, COLORS.white, true);
  groupRow.getCell(3).numFmt = '0%';

  group.kppn.forEach((unit, index) => {
    const row = worksheet.addRow([
      index + 1,
      unit.alias || unit.name,
      unit.bobotKPPN / 100,
      unit.pb.nilai,
      unit.pb.bobot / 100,
      unit.pb.kontribusi,
      componentValue(unit.spml, 'nilai'),
      componentWeight(unit.spml),
      componentValue(unit.spml, 'kontribusi'),
      componentValue(unit.ck, 'nilai'),
      componentWeight(unit.ck),
      componentValue(unit.ck, 'kontribusi'),
      unit.nilaiAKK,
      unit.bobotKPPN / 100,
      unit.nilaiPenyumbangLHPS,
    ]);
    row.height = 22;
    styleRange(row, COLORS.white, COLORS.black, false);
    [3, 5, 8, 11, 14].forEach((column) => {
      if (typeof row.getCell(column).value === 'number') row.getCell(column).numFmt = '0%';
    });
    [4, 6, 7, 9, 10, 12, 13, 15].forEach((column) => {
      if (typeof row.getCell(column).value === 'number') row.getCell(column).numFmt = '0.00';
    });
  });

  const subtotal = worksheet.addRow([
    `Rata-rata AKK ${group.label}`,
    '', '', '', '', '', '', '', '', '', '', '', '',
    group.bobot / 100,
    group.kontribusiLHPS,
  ]);
  worksheet.mergeCells(`A${subtotal.number}:M${subtotal.number}`);
  subtotal.height = 23;
  styleRange(subtotal, COLORS.subtotal, COLORS.black, true);
  subtotal.getCell(14).numFmt = '0%';
  subtotal.getCell(15).numFmt = '0.00';
}

function addFooter(worksheet: ExcelJS.Worksheet, data: AKKContributorLHPSResponse) {
  const rows = [
    ['Jumlah Nilai AKK Seluruh KPPN', data.jumlahNilaiAKKSeluruhKPPN, '0.00'],
    ['Jumlah Bobot KPPN yang Memenuhi', data.jumlahBobotKPPNYangMemenuhi / 100, '0%'],
  ] as const;

  rows.forEach(([label, value, numberFormat]) => {
    const row = worksheet.addRow([label, '', '', '', '', '', '', '', '', '', '', '', '', '', value]);
    worksheet.mergeCells(`A${row.number}:N${row.number}`);
    row.height = 24;
    styleRange(row, COLORS.group, COLORS.white, true);
    row.getCell(15).numFmt = numberFormat;
  });

  const finalRow = worksheet.addRow([
    'NILAI AKHIR ASPEK KINERJA KPPN LINGKUP KANWIL DJPb PROVINSI SUMATERA BARAT',
    '', '', '', '', '', '', '', '', '', '', '', '', '', data.nilaiAkhirAspekKinerja,
  ]);
  worksheet.mergeCells(`A${finalRow.number}:N${finalRow.number}`);
  finalRow.height = 34;
  styleRange(finalRow, COLORS.header, COLORS.white, true);
  finalRow.getCell(1).font = {
    name: 'Calibri', size: 13, bold: true, color: { argb: COLORS.white },
  };
  finalRow.getCell(15).font = {
    name: 'Calibri', size: 15, bold: true, color: { argb: COLORS.black },
  };
  finalRow.getCell(15).fill = {
    type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.score },
  };
  finalRow.getCell(15).numFmt = '0.00';
}

function componentValue(
  detail: AKKComponentDetail | null,
  key: 'nilai' | 'kontribusi'
) {
  return detail?.[key] ?? '-';
}

function componentWeight(detail: AKKComponentDetail | null) {
  return detail ? detail.bobot / 100 : '-';
}

function formatHeaderWeight(value: number | null) {
  return value === null ? 'Tidak berlaku' : `${value}%`;
}

function styleRange(row: ExcelJS.Row, fillColor: string, textColor: string, bold: boolean) {
  for (let column = 1; column <= 15; column += 1) {
    const cell = row.getCell(column);
    cell.border = BORDER;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
    cell.font = { name: 'Calibri', size: 10, bold, color: { argb: textColor } };
    cell.alignment = {
      horizontal: column === 2 && !bold ? 'left' : 'center',
      vertical: 'middle',
      wrapText: true,
    };
  }
}

function safeFileName(value: string) {
  return value.trim().replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, '_');
}

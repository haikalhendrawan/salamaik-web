import ExcelJS from 'exceljs';
import { Regulation2MatrixRow } from '../matrix/types';

const HEADERS = ['No', 'No. pada Kertas Kerja', 'Komponen Supervisi', 'Hasil Implementasi di Lapangan', 'Permasalahan', 'Rekomendasi atas Permasalahan', 'Peraturan/Ketentuan Terkait', 'PIC Subbag/Seksi', 'Tindak Lanjut Atas Permasalahan', 'Status Penyelesaian Tindak Lanjut'];
const SECTIONS = ['PB', 'SPML', 'CK'] as const;
const SECTION_LABEL = { PB: 'Proses Bisnis', SPML: 'Sarana dan Prasarana Mutu Layanan', CK: 'Capaian Kinerja' };

export default function useExcelMatrixPeraturan2(data: Regulation2MatrixRow[], kppnName: string, periodName: string) {
  const generate = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('MHS');
    sheet.columns = [5, 12, 38, 34, 41, 34, 34, 24, 20, 19].map((width) => ({ width }));
    [
      `MATRIKS HASIL SUPERVISI PADA ${kppnName.toUpperCase()}`,
      'KANWIL DIREKTORAT JENDERAL PERBENDAHARAAN PROVINSI SUMATERA BARAT',
      `PERIODE ${periodName.toUpperCase()}`,
    ].forEach((title, index) => {
      const rowNumber = index + 1;
      sheet.mergeCells(rowNumber, 1, rowNumber, 10);
      const cell = sheet.getCell(rowNumber, 1);
      cell.value = title;
      cell.font = { bold: true, size: 12 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });
    const header = sheet.getRow(5);
    HEADERS.forEach((value, index) => { header.getCell(index + 1).value = value; });
    header.height = 48;
    header.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9EAD3' } };
      cell.border = { top: { style: 'thin' }, right: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' } };
    });

    let number = 1;
    SECTIONS.forEach((section) => {
      const sectionRows = data.filter((row) => row.worksheet_type === section);
      if (!sectionRows.length) return;
      const sectionRow = sheet.addRow([SECTION_LABEL[section]]);
      sheet.mergeCells(sectionRow.number, 1, sectionRow.number, 10);
      sectionRow.getCell(1).font = { bold: true };
      sectionRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
      sectionRows.forEach((item) => {
        const row = sheet.addRow([number++, item.nomor_kertas_kerja, item.komponen_supervisi, item.hasil_implementasi, item.permasalahan, item.rekomendasi, item.peraturan, item.uic, item.tindak_lanjut, item.status_penyelesaian]);
        row.eachCell({ includeEmpty: true }, (cell) => {
          cell.alignment = { vertical: 'top', wrapText: true };
          cell.border = { top: { style: 'thin' }, right: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' } };
        });
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    link.download = `Matriks_PER2_${kppnName}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  return { generate };
}

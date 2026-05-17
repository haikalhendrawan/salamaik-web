import ExcelJS from 'exceljs';
//-----------------------------------------------------------------------------------------------------------------
interface SectionedMatrixType{
  komponenSupervisi: string | null,
  hasilImplementasi: string | null,
  permasalahan: string | null,
  rekomendasi: string  | null,
  peraturan: string | null,
  uic: string | null,
  tindakLanjut: string | null,
  status: number | string | null,
  isFinding: boolean | null,
  subkomponen: string   | null,
  komponen: string | null
};
//-----------------------------------------------------------------------------------------------------------------
export default function useExcelMatrix(data: SectionedMatrixType[], kppnName: string, periodName: string) {
  const generate = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
  
    // Insert a title row above the header
    const titleRow = worksheet.getRow(1);
    titleRow.height = 50;
    titleRow.getCell(1).font = { bold: true, size: 14 };
    titleRow.getCell(1).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
  
    worksheet.mergeCells('A1:I1');
  
    worksheet.columns = [
      { header: 'No.', key: 'nomor', width: 8 },
      { header: 'Komponen Supervisi', key: 'komponenSupervisi', width: 25 },
      { header: 'Hasil Implementasi di Lapangan', key: 'hasilImplementasi', width: 35 },
      { header: 'Permasalahan (Apabila Ada)', key: 'permasalahan', width: 35 },
      { header: 'Rekomendasi Atas Permasalahan', key: 'rekomendasi', width: 35 },
      { header: 'Peraturan Terkait', key: 'peraturan', width: 15 },
      { header: 'PIC Subbag/Seksi', key: 'uic', width: 15 },
      { header: 'Tindak Lanjut Atas Permasalahan', key: 'tindakLanjut', width: 35 },
      { header: 'Status Penyelesaian Tindak Lanjut', key: 'status', width: 10 },
    ];
  
    // Add header row
    const headerRow = worksheet.getRow(2);
    worksheet.columns.forEach((col, index) => {
      const headerValue = typeof col.header === "string" ? col.header : (col.header || []).join(" ");
      headerRow.getCell(index + 1).value = headerValue;
    });
  
    headerRow.height = 50;
    headerRow.eachCell((cell) => {
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
      cell.font = { bold: true, size: 10 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FDE9D9' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  
    worksheet.getCell('A1').value = `Matriks Hasil Supervisi Pada ${kppnName} \n Kanwil Direktorat Jenderal Perbendaharaan Provinsi Sumatera Barat \n ${periodName}`; 
    worksheet.getCell('A1').alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true
    };
    worksheet.getCell('A1').font = { bold: true, size: 12 };
    worksheet.getRow(1).height = 60;
    worksheet.getRow(0).height = 60;
    
    let lastKomponen: string | null = null;
    let mergeStartRowForKomponen = 3;
  
    let lastSubkomponen: string | null = null;
    let mergeStartRowForSubkomponen: number | null = 3;
    let i = 1;
  
  
    data.forEach((item, index) => {
      const komponen = item.komponen;
      const subkomponen = item.subkomponen;
  
      if (index !== data.length - 1 && data[index].komponen !== data[index + 1].komponen) {
        i++;
      }
  
      Object.keys(item).forEach(key => {
        const typedKey = key as keyof typeof item;
        if (item[typedKey] === null || item[typedKey] === undefined) {
          item[typedKey] = "" as any;
        }
      });
  
      const row = worksheet.addRow({
        nomor: i,
        ...item,
      });
  
      if (komponen !== lastKomponen && lastKomponen !== null) {
        worksheet.mergeCells(`A${mergeStartRowForKomponen}:A${row.number - 1}`);
        mergeStartRowForKomponen = row.number;
      }
  
      if (subkomponen !== lastSubkomponen && lastSubkomponen !== null) {
        worksheet.mergeCells(`B${mergeStartRowForSubkomponen}:B${row.number - 1}`);
        mergeStartRowForSubkomponen = row.number;
      }
  
      lastKomponen = komponen;
      lastSubkomponen = subkomponen;
  
      const isFinding = item.isFinding;
  
      row.eachCell((cell, colNumber) => {
        cell.alignment = {
          wrapText: true,
          vertical: 'middle',
          horizontal: 'center',
        };
  
        cell.font = { size: 10 };
  
        if (colNumber === 1 || colNumber === 2) {
          cell.alignment.vertical = 'top';
          if (colNumber === 2 && typeof cell.value === 'string') {
            const [komponen, subkomponen] = cell.value.split('\n');
            cell.value = {
              richText: [
                { font: { bold: true }, text: komponen },
                { text: `\n${subkomponen}` }
              ]
            };
          }
        }
  
        if (isFinding) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF00' },
          };
        }
  
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
  
      row.height = 80;
    });
  
    if (mergeStartRowForKomponen < (worksheet?.lastRow?.number || 0)) {
      worksheet.mergeCells(`A${mergeStartRowForKomponen}:A${worksheet?.lastRow?.number || 0}`);
    }
  
    if (mergeStartRowForSubkomponen < (worksheet?.lastRow?.number || 0)) {
      worksheet.mergeCells(`B${mergeStartRowForSubkomponen}:B${worksheet?.lastRow?.number || 0}`);
    }
  
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Matrix_${new Date().toLocaleDateString('en-GB')}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { generate };
}
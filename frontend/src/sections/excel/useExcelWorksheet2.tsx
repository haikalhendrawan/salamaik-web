import ExcelJS from 'exceljs';
import { WsJunctionType } from '../worksheet/types';
//-----------------------------------------------------------------------------------------------------------------
interface KomponenRefType{
  id: number,
  title: string,
  bobot: number,
  detail?: string,
  alias?: string,
};

interface SubKomponenRefType{
  id: number,
  komponen_id: number,
  title: string,
  detail?: string,
  alias?: string,
};
//-----------------------------------------------------------------------------------------------------------------
export default function useExcelWorksheet2(checklist: WsJunctionType[], kppnName: string, komponenRef: KomponenRefType[] | null, subKomponenRef: SubKomponenRefType[] | null) {
  const generate = async () => {
    try{
      const workbook = new ExcelJS.Workbook();
  

      const sheet = workbook.addWorksheet('KK_PB', {
        views: [{ state: "frozen", ySplit: 1 }],
      });
  
      
      // =========================================================================
      // 1. COLUMN CONFIG
      // =========================================================================
      const columnConfig = [
        { key: "no", header: "No", width: 3.71 },
        { key: "title", header: "Materi", width: 20.43 },
        { key: "kriteria_penilaian", header: "Kriteria Penilaian", width: 55.43 },
        { key: "critical_point", header: "Critical Point", width: 38.71 },
        { key: "dasar_hukum", header: "Dasar Hukum", width: 52.43 },
        { key: "contoh_file", header: "Bukti Dukung", width: 34 },
        { key: "link_file", header: "Link Bukti Dukung", width: 51.43 },
        { key: "kanwil_score", header: `${kppnName} \n _______________________ \n Nilai \n \n *jika tidak mempunyai transaksi maka kolom diisi N/A`, width: 30 },
        { key: "konversi", header: "Nilai Konversi", width: 9 },
      ];
    
      sheet.columns = columnConfig;
      sheet.getRow(1).height = 90;

      // =========================================================================
      // 2. HEADER
      // =========================================================================

      const headerCells = [
        'A1',
        'B1',
        'C1',
        'D1',
        'E1',
        'F1',
        'G1',
        'H1',
        'I1',
      ];

      headerCells.forEach((cellAddress) => {
        const cell = sheet.getCell(cellAddress);

        cell.font = {
          bold: true,
          name: 'Aptos Narrow',
          size: 11,
        };

        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };

        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'BFBFBF' },
        };

        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // =========================================================================
      // 3. BODY
      // =========================================================================
      komponenRef?.forEach((komponen) => {
        generateKomponenRow(sheet, komponen);

        //Subkomponen
        subKomponenRef?.filter((item) => item.komponen_id === komponen.id).forEach((subKomponen) => {
          generateSubKomponenRow(sheet, subKomponen);

          // checklist
          checklist.filter((item) => item.subkomponen_id === subKomponen.id).forEach((ch: WsJunctionType) => {
            generateChecklistRow(sheet, ch);
          });
        });
      });

      // =========================================================================
      // 4. GENERATE
      // =========================================================================
      const buffer = await workbook.xlsx.writeBuffer();
    
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Worksheet_${new Date().getTime()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }catch(err){
      console.error(err);
    }
  };

  return { generate };
}

//-----------------------------------------------------------------------------------------------------------------
function generateKomponenRow (sheet: ExcelJS.Worksheet, komponen: KomponenRefType): void {
  const rowKomponen = sheet.addRow({
    no: komponen.title
  });
  const rowNumber = rowKomponen.number;
  sheet.mergeCells(`A${rowNumber}:I${rowNumber}`);

  const cell = sheet.getCell(`A${rowNumber}`);
  cell.font = {
    bold: true,
    size: 11,
    name: 'Aptos Narrow',
  };
  cell.alignment = {
    vertical: 'top',
    horizontal: 'left',
    wrapText: true,
  };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' },
  };
  cell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
  rowKomponen.height = 20;
};

function generateSubKomponenRow (sheet: ExcelJS.Worksheet, subKomponen: SubKomponenRefType): void {
  const rowSubKomponen = sheet.addRow({
    no: subKomponen.title
  });
  const rowNumber = rowSubKomponen.number;
  sheet.mergeCells(`A${rowNumber}:I${rowNumber}`);

  const cell = sheet.getCell(`A${rowNumber}`);
  cell.font = {
    bold: true,
    size: 11,
    name: 'Aptos Narrow',
  };
  cell.alignment = {
    vertical: 'top',
    horizontal: 'left',
    wrapText: true,
  };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'D9D9D9' },
  };
  cell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
  rowSubKomponen.height = 20;
};

function generateChecklistRow (sheet: ExcelJS.Worksheet, row: WsJunctionType): void {
  const isStandardisasi = row.standardisasi === 1;
    
  const opsiText = !isStandardisasi && row?.opsi
    ?.map((item) => `-Nilai ${item?.value}\n ${item?.title}\n`)
    .join("") || ""; 

  const formattedHeader = row.header? row.header.replace(/\n/g, "\r\n") : ""; 

  const kriteriaText = [
    { text: `${formattedHeader} \n` || "" }, 
    { text: `\n${opsiText}` }, 
  ];

  const addedRow = sheet.addRow({
    no: row.checklist_id,
    title: row.title || "",
    kriteria_penilaian: { richText: kriteriaText },
    critical_point: row.critical_point|| "",
    dasar_hukum: row.peraturan || "",
    contoh_file: row.contoh_file || "",
    link_file: row.link_file || "",
    kanwil_score: row.excluded ? "N/A" : row.kanwil_score,
    konversi: (row?.kanwil_score || 0) * 10 || "",
  });

  addedRow.height = 100;
  addedRow.height = 170;
  addedRow.eachCell({ includeEmpty: true }, (cellx) => {
    cellx.alignment = { 
      vertical: 'top', 
      horizontal: 'left', 
      wrapText: true 
    };
    cellx.font = {
      name: 'Aptos Narrow',
      size: 11,
    };
  });
};
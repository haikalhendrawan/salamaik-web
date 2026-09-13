import ExcelJS from 'exceljs';
import { PBScoreType, WsJunctionType } from '../worksheet/types';
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
export default function useExcelWorksheet(rows: WsJunctionType[], pbScore: PBScoreType, komponenRef: KomponenRefType[] | null, subKomponenRef: SubKomponenRefType[] | null) {
  const generate = async () => {
    try{
      const workbook = new ExcelJS.Workbook();
  
      komponenRef?.forEach((komponen) => {
        workbook.addWorksheet(komponen.alias, {
          views: [{ state: "frozen", ySplit: 1 }],
        })
      });
    
      // 1. Define columns with keys, headers, and widths
      const columnConfig = [
        { key: "no", header: "No", width: 10 },
        { key: "checklist", header: "Checklist", width: 90 },
        { key: "kppn_score", header: "Nilai KPPN", width: 10 },
        { key: "kanwil_score", header: "Nilai Kanwil", width: 10 },
        { key: "kanwil_note", header: "Catatan Kanwil", width: 30 },
        { key: "excluded", header: "Excluded", width: 10 },
        { key: "last_update", header: "Last Update", width: 15 },
        { key: "updated_by", header: "Last Updated By", width: 15 },
        { key: "subkomponen", header: "Subkomponen", width: 15 },
      ];
    
      // 2. Set worksheet columns
      workbook.eachSheet((sheet) => {
        sheet.columns = columnConfig;
      });
    
      // 3. Generate row and cell
      rows.forEach((row: WsJunctionType) => {
        const isStandardisasi = row.standardisasi === 1;
    
        const opsiText = !isStandardisasi && row?.opsi
          ?.map((item) => `Nilai ${item?.value}: ${item?.title}\n`)
          .join("") || ""; 
    
        const formattedHeader = row.header? row.header.replace(/\n/g, "\r\n") : ""; 
    
        const checklistText = [
          { text: `${row?.title}\n\n` || "", font: { bold: true } }, 
          { text: `${formattedHeader} \n` || "", font: { bold: true } }, 
          { text: `\n${opsiText}` }, 
        ];
  
        const selectedSheet = workbook.getWorksheet(komponenRef?.find((komponen) => komponen.id === row.komponen_id)?.alias);
    
        const addedRow = selectedSheet?.addRow({
          no: row.checklist_id,
          checklist: { richText: checklistText },
          kppn_score: row.kppn_score || "",
          kanwil_score: row.kanwil_score || "",
          kanwil_note: row.kanwil_note || "",
          excluded: row.excluded === 1 ? "Y" : "N",
          last_update: row.last_update ? new Date(row.last_update).toLocaleString("en-GB"): "",
          updated_by: row.updated_by || "",
          subkomponen: subKomponenRef?.find((subKomponen) => subKomponen.id === row.subkomponen_id)?.title || '',
        });
  
        if (row.excluded === 1) {
          addedRow?.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "D3D3D3" }, // Grey color
            };
          });
        }
      });
    
      // 4. Apply alignment styles
      workbook.eachSheet((sheet) => {
        sheet.columns.forEach((column) => {
          sheet.getColumn(column.key as string).alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
          };
        });
      })
  
      // 5. Set row height
      workbook.eachSheet((sheet) => {
        sheet.eachRow((row, rowIndex) => {
          row.height = 100;
          if (rowIndex > 1) { 
            row.height = 170;
            const cell = row.getCell('B'); 
            cell.alignment = { vertical: 'top', horizontal: 'justify', wrapText: true };
          }
        })
      })
  
      // 6. Sheet nilai
      const sheetNilai = workbook.addWorksheet("Nilai");
  
      const columnConfig2 = [
        { key: "no", header: "No", width: 10 },
        { key: "komponen", header: "Nama Komponen", width: 90 },
        { key: "total", header: "Total Nilai", width: 10 },
        { key: "pembagi", header: "Bilangan Pembagi", width: 10 },
        { key: "avg", header: "Rata-Rata Nilai", width: 30 },
        { key: "bobot", header: "Bobot Nilai", width: 10 },
        { key: "weighted_avg", header: "Nilai Tertimbang", width: 15 },
      ];
      
      sheetNilai.columns = columnConfig2;
  
      sheetNilai.getColumn("D").width = 20;

      addScoreSection(
        sheetNilai,
        "Nilai Berdasarkan Penilaian Kanwil",
        columnConfig2,
        pbScore.detailKanwil.detailKomponen,
        pbScore.nilaiKanwil
      );
      sheetNilai.addRow([]);
      addScoreSection(
        sheetNilai,
        "Nilai Berdasarkan Penilaian Self Assessment KPPN",
        columnConfig2,
        pbScore.detailKPPN.detailKomponen,
        pbScore.nilaiKPPN
      );
    
      // 7. Generate Excel file
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

function addScoreSection(
  sheet: ExcelJS.Worksheet,
  title: string,
  columns: { header: string }[],
  components: PBScoreType['detailKPPN']['detailKomponen'],
  finalScore: number
) {
  const titleRow = sheet.addRow([title]);
  sheet.mergeCells(`A${titleRow.number}:G${titleRow.number}`);
  titleRow.height = 34;
  titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
  titleRow.getCell(1).font = { bold: true, size: 12 };

  sheet.addRow(columns.map((column) => column.header));

  components.forEach((item, index) => {
    sheet.addRow({
      no: index + 1,
      komponen: item.komponenTitle,
      total: item.totalSkorKonversi,
      pembagi: item.jumlahChecklistPembagi,
      avg: item.nilaiRataRata,
      bobot: `${item.komponenBobot}%`,
      weighted_avg: item.nilaiTerbobot,
    });
  });

  sheet.addRow(['', 'Nilai Akhir', '', '', '', '', finalScore]);
}

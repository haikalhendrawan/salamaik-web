import { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';
import {Tooltip, IconButton} from '@mui/material';
import Iconify from '../../../../components/iconify';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import useDictionary from '../../../../hooks/useDictionary';
import { MatrixScoreAndProgressType, MatrixWithWsJunctionType } from '../../../matrix/types';
import useSnackbar from '../../../../hooks/display/useSnackbar';

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

export interface FindingsResponseType{
  id: number,
  ws_junction_id: number,
  worksheet_id: string,
  checklist_id: number,
  matrix_id: number, 
  kppn_response: string,
  kanwil_response: string,
  score_before: number,
  score_after: number,
  last_update: string,
  updated_by: string,
  status: number,
  matrixDetail: MatrixWithWsJunctionType[],
};
// ----------------------------------------------------------------------------------
export default function ExcelPrintout({kppnId, period}: {kppnId: string, period: number}) {
  const axiosJWT = useAxiosJWT();

  const {komponenRef, subKomponenRef, kppnRef, periodRef} = useDictionary();

  const kppnName = kppnRef?.list?.find((item) =>item.id === kppnId)?.alias || '';

  const periodName = periodRef?.list?.find((item) =>item.id === period)?.name || '';

  const [findings, setFindings] = useState<FindingsResponseType[] | []>([]);

  const {openSnackbar} = useSnackbar();

  const getFindings = async() => {
    try{
      if(!kppnId){
        return 
      };

      const response = await axiosJWT.get(`/getFindingsByWorksheetId/${kppnId}/${period}`);
      setFindings(response.data.rows);

    }catch(err: any){
      if(err.response){
        openSnackbar(err.response.data.message, "error");
      }else{
        openSnackbar('network error', "error");
      }
    }
  };

  async function handleGenerateExcel() {
    try {
      const response2 = await axiosJWT.post(`/getWsJunctionScoreAndProgress`, {kppnId, period});

      const matrixScore = response2.data.rows;

      await produceExcel(findings, matrixScore, komponenRef, subKomponenRef, kppnName, periodName);
    } catch (error) {
      console.error("Error generating Excel:", error);
    }
  };

  useEffect(() => {
    getFindings()
  }, [kppnId])

  return (
    <>
      <Tooltip title="export excel">
        <IconButton onClick={handleGenerateExcel}>
          <Iconify icon="vscode-icons:file-type-excel"/>
        </IconButton>
      </Tooltip> 
    </>
  )
}
// -------------------------------------------------------------------------------------------------------------------------------------------
const API_URL = import.meta.env.VITE_API_URL;

const produceExcel = async (
    findings: FindingsResponseType[], 
    matrixScore: MatrixScoreAndProgressType,
    komponenRef: KomponenRefType[] | null, 
    subKomponenRef: SubKomponenRefType[] | null,
    kppnName: string,
    periodName: string
  ) => {
    try{
      let workbook = new ExcelJS.Workbook();
      workbook = generateSheet1(workbook, findings, kppnName, periodName);
      workbook = generateSheet2(workbook, findings, kppnName, periodName);
      workbook = generateSheet3(workbook, findings, komponenRef, subKomponenRef);

      if(!(matrixScore?.isFinal)){
        //delete sheet1
        workbook.removeWorksheet("Permasalahan Final");
      }

      const buffer = await workbook.xlsx.writeBuffer();
    
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Worksheet_${new Date().getTime()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }catch(err){
      console.error(err)
    }
}

const generateSheet1 = (
    workbook: ExcelJS.Workbook,
    findings: FindingsResponseType[] | [],
    kppnName: string,
    periodName: string 
  ) => {
    const sheet1 = workbook.addWorksheet("Permasalahan Final", {
      views: [{ state: "frozen", ySplit: 1 }]
    });

    const columnConfig = [
      { key: "no", header: "No", width: 10 },
      { key: "komponen", header: "Nama Komponen", width: 25 },
      { key: "subkomponen", header: "Subkomponen", width: 35 },
      { key: "checklist", header: "Checklist", width: 50 },
      { key: "permasalahan", header: "Permasalahan", width: 40 },
      { key: "rekomendasi", header: "Rekomendasi atas permasalahan", width: 40 },
      { key: "peraturan", header: "Peraturan Terkait", width: 25 },
      { key: "pic", header: "PIC", width: 15 },
    ];
    
    sheet1.columns = columnConfig;

    sheet1.mergeCells("A1:H1");
    sheet1.getCell("A1").value = `Rekapitulasi Permasalahan (Final) \n ${kppnName} \n ${periodName}`; 
    sheet1.getCell("A1").alignment = { horizontal: "center" }; 
    sheet1.getCell("A1").font = { bold: true, size: 12 }; 
    sheet1.getColumn("D").width = 20;
    sheet1.getRow(1).height = 34;

    sheet1.getRow(2).values = columnConfig.map((col) => col.header);

    findings = findings?.filter((f) => {
      const isStandardisasi = (f.matrixDetail?.[0]?.checklist?.[0]?.standardisasi) === 1;
      const maxScore = isStandardisasi ? 12 : 10;

      return (f?.matrixDetail?.[0]?.ws_junction?.[0]?.kanwil_score || 0) !== maxScore
    })

    findings?.forEach((finding, index) => {
      const matrixDetail = finding.matrixDetail?.[0] || null;
      sheet1.addRow({
        no: index + 1,
        komponen: matrixDetail?.komponen_string || "",
        subkomponen: matrixDetail?.subkomponen_string || "",
        checklist: matrixDetail?.checklist[0]?.title || "",
        permasalahan: matrixDetail?.permasalahan || "",
        rekomendasi: matrixDetail?.rekomendasi || "",
        peraturan: matrixDetail?.peraturan || "",
        pic: matrixDetail?.uic || ""
      })
    })

    sheet1.eachRow((row, rowIndex) => {
      row.height = 100;
      if (rowIndex > 1) { 
        row.height = 100;
      }
    })

    return workbook

};

const generateSheet2 = (
  workbook: ExcelJS.Workbook,
  findings: FindingsResponseType[] | [],
  kppnName: string,
  periodName: string  
) => {
  const sheet1 = workbook.addWorksheet("Permasalahan Non Final", {
    views: [{ state: "frozen", ySplit: 1 }]
  });

  const columnConfig = [
    { key: "no", header: "No", width: 10 },
    { key: "komponen", header: "Nama Komponen", width: 25 },
    { key: "subkomponen", header: "Subkomponen", width: 35 },
    { key: "checklist", header: "Checklist", width: 50 },
    { key: "permasalahan", header: "Permasalahan", width: 40 },
    { key: "rekomendasi", header: "Rekomendasi atas permasalahan", width: 40 },
    { key: "peraturan", header: "Peraturan Terkait", width: 25 },
    { key: "pic", header: "PIC", width: 15 },
  ];
  
  sheet1.columns = columnConfig;

  sheet1.mergeCells("A1:H1");
  sheet1.getCell("A1").value = `Rekapitulasi Permasalahan (Non-Final) \n ${kppnName} \n ${periodName}`; 
  sheet1.getCell("A1").alignment = { horizontal: "center" }; 
  sheet1.getCell("A1").font = { bold: true, size: 12 }; 
  sheet1.getColumn("D").width = 20;
  sheet1.getRow(1).height = 34;

  sheet1.getRow(2).values = columnConfig.map((col) => col.header);

  findings?.forEach((finding, index) => {
    const matrixDetail = finding.matrixDetail?.[0] || null;
    sheet1.addRow({
      no: index + 1,
      komponen: matrixDetail?.komponen_string || "",
      subkomponen: matrixDetail?.subkomponen_string || "",
      checklist: matrixDetail?.checklist[0]?.title || "",
      permasalahan: matrixDetail?.permasalahan || "",
      rekomendasi: matrixDetail?.rekomendasi || "",
      peraturan: matrixDetail?.peraturan || "",
      pic: matrixDetail?.uic || ""
    })
  })

  sheet1.eachRow((row, rowIndex) => {
    row.height = 100;
    if (rowIndex > 1) { 
      row.height = 100;
    }
  })

  return workbook

};

const generateSheet3 = (
    workbook: ExcelJS.Workbook, 
    findings: FindingsResponseType[] | [], 
    komponenRef: KomponenRefType[] | null, 
    subKomponenRef: SubKomponenRefType[] | null
  ) => {
    const sheet3 = workbook.addWorksheet("checklist raw", {
      views: [{ state: "frozen", ySplit: 1 }]
    });

    // 1. Define columns with keys, headers, and widths
    const columnConfig = [
      { key: "no", header: "No", width: 10 },
      { key: "checklist_num", header: "No Checklist", width: 10 },
      { key: "checklist", header: "Checklist", width: 90 },
      { key: "kppn_score", header: "Nilai KPPN", width: 10 },
      { key: "kanwil_score", header: "Nilai Kanwil", width: 10 },
      { key: "kanwil_note", header: "Catatan Kanwil", width: 30 },
      { key: "excluded", header: "Excluded", width: 10 },
      { key: "last_update", header: "Last Update", width: 15 },
      { key: "updated_by", header: "Last Updated By", width: 15 },
      { key: "komponen", header: "Komponen", width: 15 },
      { key: "subkomponen", header: "Subkomponen", width: 15 },
      { key: "file", header: "file", width: 40 },
    ];

    // 2. Set worksheet columns
    sheet3.columns = columnConfig;

    const permasalahan = findings?.map((finding) => finding?.matrixDetail || null);

    // 3. Generate row and cell
    permasalahan.forEach((row, index) => {
      const junction = row?.[0]?.ws_junction?.[0];

      const checklist = row?.[0]?.checklist?.[0];

      const opsi = row?.[0]?.opsi;

      const isStandardisasi = junction.standardisasi === 1;

      const opsiText = !isStandardisasi && opsi
        ?.map((item) => `Nilai ${item?.value}: ${item?.title}\n`)
        .join("") || ""; 

      const formattedHeader = checklist.header ? checklist.header.replace(/\n/g, "\r\n") : ""; 

      const checklistText = [
        { text: `${checklist?.title}\n\n` || "", font: { bold: true } }, 
        { text: `${formattedHeader} \n` || "", font: { bold: true } }, 
        { text: `\n${opsiText}` }, 
      ];

      const file1String = junction?.file_1? `${API_URL}/${junction?.file_1} \n\n` : "";
      const file2String = junction?.file_2 ? `${API_URL}/${junction?.file_2} \n\n` : "";
      const file3String = junction?.file_3 ? `${API_URL}/${junction?.file_3} \n\n` : "";

      const maxScore = isStandardisasi ? 12 : 10;

      const isPermasalahanResolved = (junction?.kanwil_score === junction?.kppn_score) && (junction?.kanwil_score === maxScore);

      // make the text hyperlink
      const fileText = [
        {
          text: file1String ,
          hyperlink: junction?.file_1 || ""
        },
        {
          text: file2String ,
          hyperlink: junction?.file_2 || ""
        },
        {
          text: file3String ,
          hyperlink: junction?.file_3 || ""
        },
      ];

      const addedRow = sheet3?.addRow({
        no: index+1,
        checklist_num: junction.checklist_id,
        checklist: { richText: checklistText },
        kppn_score: junction.kppn_score || "",
        kanwil_score: junction.kanwil_score || "",
        kanwil_note: junction.kanwil_note || "",
        excluded: junction.excluded === 1 ? "Y" : "N",
        last_update: junction.last_update ? new Date(junction.last_update).toLocaleString("en-GB"): "",
        updated_by: junction.updated_by || "",
        komponen: komponenRef?.find((komponen) => komponen.id === checklist.komponen_id)?.title || '',
        subkomponen: subKomponenRef?.find((subKomponen) => subKomponen.id === checklist.subkomponen_id)?.title || '',
        file: { richText: fileText },
      });

      if (junction.excluded === 1) {
        addedRow?.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D3D3D3" }, // Grey color
          };
        });
      }

      if (isPermasalahanResolved) {
        addedRow?.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "32a852" }, // Green Color
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
   
    sheet3.eachRow((row, rowIndex) => {
      row.height = 100;
      if (rowIndex > 1) { 
        row.height = 170;
        const cell = row.getCell('C'); 
        cell.alignment = { vertical: 'top', horizontal: 'justify', wrapText: true };
        const cellFile = row.getCell('L'); 
        cellFile.font = { ...cell.font, underline: true, color: { theme: 10 } };
      }
    })

    const lastRow = sheet3?.addRow({
      no: "",
      checklist_num: `: Permasalahan telah diselesaikan (tidak dihitung sebagai permasalahan final)`,
    });

    sheet3.mergeCells(`B${lastRow.number}:D${lastRow.number}`);

    lastRow.getCell("A").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "32a852" }, // Green Color
    };

    lastRow.getCell("B").alignment = { vertical: 'top', horizontal: 'justify', wrapText: true };

    return workbook
}

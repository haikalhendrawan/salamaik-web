// @mui
import { Button, Select, FormControl, InputLabel, MenuItem} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import Iconify from '../../../../components/iconify/Iconify';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import { MatrixWithWsJunctionType } from '../../types';
import useDictionary from '../../../../hooks/useDictionary';
import useLoading from '../../../../hooks/display/useLoading';
import { useAuth } from '../../../../hooks/useAuth';
import ExcelJS from 'exceljs';
import pptxgen from 'pptxgenjs';
import HTMLTable from '../HTMLTable';

// ---------------------------------------------------------------------------------------------------------
const StyledDiv = styled('div')(({theme}) => ({
  display:'flex',
  marginBottom: theme.spacing(2),
  gap: theme.spacing(1)
}));

interface MatrixTableToolbarProps{
  matrixStatus: number | null,
  selectedKomponen: string  | null,
  setSelectedKomponen: React.Dispatch<React.SetStateAction<string | null>>,
  getMatrix: () => Promise<void>,
  matrix: MatrixWithWsJunctionType[]
};

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

const STATUS_STRING = ['Belum', 'Proses', 'Ditolak', 'Disetujui'];

// -----------------------------------------------------------------------------------------------------------
export default function MatrixTableToolbar({matrixStatus, selectedKomponen, setSelectedKomponen, getMatrix, matrix}: MatrixTableToolbarProps) {
  const theme = useTheme();

  const {komponenRef, periodRef, kppnRef} = useDictionary();

  const {setIsLoading} = useLoading();

  const {openSnackbar} = useSnackbar();

  const {auth} = useAuth();

  const axiosJWT = useAxiosJWT();

  const kppnId = new URLSearchParams(useLocation().search).get("id");

  const kppnName = kppnRef?.list?.find((item) => item.id === kppnId)?.alias || "";

  const periodName = periodRef?.list?.find((item) => item.id === auth?.period)?.name || "";

  const handlePrintPPTX = async () => {
    const ppt = new pptxgen();
    const rowsPerSlide = 2;
  
    const TABLE_HEAD = [
      'No', 'Komponen Supervisi', 'Hal', 'Permasalahan', 'Rekomendasi', 'Peraturan Terkait', 'UIC'
    ];

    const headerRow = TABLE_HEAD.map((item) => ({
      text: item,
      options: { fill: { color: "#4472C4" }, color: "FFFFFF", bold: true }
    }));
  
    const dataRows = matrix?.filter((mx) => mx.is_finding === 1).map((item, index) => {
      const color = index % 2 === 0 ? "#CFD5EA" : "#E9EBF5";
      return[
        { text: (index + 1).toString(), options: { fill: { color: color } } },
        { text: item.komponen_string || '', options: { fill: { color: color } } },
        { text: item.checklist[0]?.title || '', options: { fill: { color: color } } },
        { text: item.permasalahan || '', options: { fill: { color: color } } },
        { text: item.rekomendasi || '', options: { fill: { color: color } } },
        { text: item.peraturan || '', options: { fill: { color: color } } },
        { text: item.uic || '', options: { fill: { color: color } } }
      ]
    });
  
    // Split the rows into chunks for each slide
    const chunks = [];
    for (let i = 0; i < dataRows.length; i += rowsPerSlide) {
      chunks.push(dataRows.slice(i, i + rowsPerSlide));
    }

  // Create slides and add the corresponding table data
  chunks.forEach((chunk, slideIndex) => {
    const slide = ppt.addSlide();
    const tableData = [headerRow, ...chunk];

    const tableOptions = {
      x: 0.5,
      y: 0.5,
      w: 9,
      border: { pt: 1, color: "FFFFFF" }
    };

    slide.addTable(tableData, tableOptions);
  });

  ppt.writeFile();
  };
  
  const sectionedMatrix: SectionedMatrixType[] = matrix?.map((item: MatrixWithWsJunctionType, i: number) => {
    const komponenSupervisi = `${item.komponen_string}\n${item.subkomponen_string}`;
    const hasilImplementasi = item.hasil_implementasi;
    const permasalahan = item.permasalahan;
    const rekomendasi = item.rekomendasi;
    const peraturan = item.peraturan;
    const uic = item.uic;
    const tindakLanjut = item.tindak_lanjut;
    const status = STATUS_STRING[item.findings?.[0]?.status];
    const isFinding = item.is_finding ===1;
    const subkomponen = item.subkomponen_string;
    const komponen = item.komponen_string;

    return {
      komponenSupervisi,
      hasilImplementasi,
      permasalahan,
      rekomendasi,
      peraturan,
      uic,
      tindakLanjut,
      status,
      isFinding,
      subkomponen,
      komponen,
    }
  });

  const flattenedMatrix = sectionedMatrix?.flat() || [];
  
  return(
    <>
      <HTMLTable matrix={matrix}/>
      <StyledDiv>
        <FormControl sx={{height:'45px', width:'30%'}}>
          <InputLabel id="komponen-select-label" sx={{typography:'body2'}}>Komponen</InputLabel>
          <Select 
            name="komponen" 
            label='Komponen'
            labelId="komponen-select-label"
            onChange={(e) => setSelectedKomponen(e.target.value)}
            value= {selectedKomponen}
            sx={{typography:'body2', fontSize:14, height:'100%'}}
          >
            {
              komponenRef?.map((item) => (
                <MenuItem key={item?.id} sx={{fontSize:14}} value={item?.id}>{item?.title}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <div style={{flexGrow:1}} />
        {/* <Button 
          variant="text"  
          endIcon={ <Iconify icon="vscode-icons:file-type-pdf2"/>}
        >
          Export
        </Button> */}
        <Button 
          variant="text"  
          endIcon={ <Iconify icon="vscode-icons:file-type-excel"/>} 
          onClick={() => handlePrintExcel(flattenedMatrix, kppnName, periodName)}
        >
          Export
        </Button>
        <Button 
          variant="text" 
          endIcon={ <Iconify icon="vscode-icons:file-type-powerpoint"/>}
          onClick={() => handlePrintPPTX()}
        >
          Export
        </Button>
      </StyledDiv>
    </>
  )
}

// -----------------------------------------------------------------------------------------------------------------
async function handlePrintExcel(data: SectionedMatrixType[], kppnName: string, periodName: string) {
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
    { header: 'Hasil Implementasi', key: 'hasilImplementasi', width: 35 },
    { header: 'Permasalahan', key: 'permasalahan', width: 35 },
    { header: 'Rekomendasi', key: 'rekomendasi', width: 35 },
    { header: 'Peraturan', key: 'peraturan', width: 15 },
    { header: 'UIC', key: 'uic', width: 15 },
    { header: 'Tindak Lanjut', key: 'tindakLanjut', width: 35 },
    { header: 'Status', key: 'status', width: 10 },
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
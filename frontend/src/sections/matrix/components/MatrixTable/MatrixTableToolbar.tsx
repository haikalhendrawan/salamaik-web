// @mui
import { Button, Select, FormControl, InputLabel, MenuItem} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import Iconify from '../../../../components/iconify/Iconify';
import useSnackbar from '../../../../hooks/display/useSnackbar';
import useAxiosJWT from '../../../../hooks/useAxiosJWT';
import { MatrixType, MatrixWithWsJunctionType } from '../../types';
import { WorksheetType } from '../../../worksheet/types';
import useDictionary from '../../../../hooks/useDictionary';
import useLoading from '../../../../hooks/display/useLoading';
import * as XLSX from "xlsx";
import ExcelJS from 'exceljs';

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
}

export default function MatrixTableToolbar({matrixStatus, selectedKomponen, setSelectedKomponen, getMatrix, matrix}: MatrixTableToolbarProps) {
  const theme = useTheme();

  const {komponenRef, subKomponenRef} = useDictionary();

  const {setIsLoading} = useLoading();

  const {openSnackbar} = useSnackbar();

  const axiosJWT = useAxiosJWT();

  const kppnId = new URLSearchParams(useLocation().search).get("id");

  const handleReAssignMatrix = async() => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.post(`/reAssignMatrix`, {kppnId: kppnId});
      await getMatrix();
      openSnackbar(response.data.message, "success");
      setIsLoading(false);
    }catch(err: any){
      setIsLoading(false);
      if(err.response){
        openSnackbar(err.response.data.message, "error");
      }else{
        openSnackbar('network error', "error");
      }
    }finally{
      setIsLoading(false);
    }
  };

  const sectionedMatrix = matrix?.map((item, i) => {
    const komponenSupervisi = `${item.komponen_string}\n${item.subkomponen_string}`;
    const hasilImplementasi = item.hasil_implementasi;
    const permasalahan = item.permasalahan;
    const rekomendasi = item.rekomendasi;
    const peraturan = item.peraturan;
    const uic = item.uic;
    const tindakLanjut = item.tindak_lanjut;
    const status = item.findings?.[0]?.status;
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

  const handlePrintExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
  
    const data = flattenedMatrix || [];
  
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
  
    const headerRow = worksheet.getRow(1);
    headerRow.height = 50;
    headerRow.eachCell((cell) => {
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
      cell.font = { bold: true, size:10 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FDE9D9' }, // Blue background color
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  
    let lastKomponen = null;
    let mergeStartRowForKomponen = 2;
  
    let lastSubkomponen = null;
    let mergeStartRowForSubkomponen = 2;
    let i = 1;
  
    data.forEach((item, index) => {
      const komponen = item.komponen;
      const subkomponen = item.subkomponen;
    
      index !== data.length - 1 && data[index].komponen !== data[index + 1].komponen ? i++ : null;
    
      // Replace null or undefined values with an empty string
      Object.keys(item).forEach(key => {
        if (item[key] === null || item[key] === undefined) {
          item[key] = "";
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

        cell.font={size:10};
    
        if (colNumber === 1 || colNumber === 2) {
          cell.alignment.vertical = 'top';
          if (colNumber === 2) {
            const [komponen, subkomponen] = cell.value.split('\n');
            cell.value = { richText: [{ font: { bold: true }, text: komponen }, { text: `\n${subkomponen}` }] };
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
  
    if (mergeStartRowForKomponen < worksheet.lastRow.number) {
      worksheet.mergeCells(`A${mergeStartRowForKomponen}:A${worksheet.lastRow.number}`);
    }
  
    if (mergeStartRowForSubkomponen < worksheet.lastRow.number) {
      worksheet.mergeCells(`B${mergeStartRowForSubkomponen}:B${worksheet.lastRow.number}`);
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
    

  return(
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
      {
        matrixStatus === 1 
        ? <Button variant='contained' endIcon={ <Iconify icon="solar:refresh-bold-duotone"/>} onClick={handleReAssignMatrix}>
            ReAssign Matriks
          </Button> 
        : null
      }
      <div style={{flexGrow:1}} />
      <Button 
        variant="text"  
        endIcon={ <Iconify icon="vscode-icons:file-type-pdf2"/>}
      >
        Export
      </Button>
      <Button variant="text"  endIcon={ <Iconify icon="vscode-icons:file-type-excel"/>} onClick={handlePrintExcel}>
        Export
      </Button>
      <Button variant="text"  endIcon={ <Iconify icon="vscode-icons:file-type-powerpoint"/>}>
        Export
      </Button>
    </StyledDiv>
  )
}
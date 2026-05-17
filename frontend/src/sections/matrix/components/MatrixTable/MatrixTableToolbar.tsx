/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

// @mui
import { Button, Select, FormControl, InputLabel, MenuItem} from '@mui/material';
import { styled} from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import Iconify from '../../../../components/iconify/Iconify';
import { MatrixWithWsJunctionType } from '../../types';
import useDictionary from '../../../../hooks/useDictionary';
import { useAuth } from '../../../../hooks/useAuth';
import pptxgen from 'pptxgenjs';
import useExcelMatrix from '../../../excel/useExcelMatrix';

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
export default function MatrixTableToolbar({ selectedKomponen, setSelectedKomponen, matrix}: MatrixTableToolbarProps) {
  const {komponenRef, periodRef, kppnRef} = useDictionary();

  const {auth} = useAuth();

  const kppnId = new URLSearchParams(useLocation().search).get("id");

  const kppnName = kppnRef?.list?.find((item) => item.id === kppnId)?.alias || "";

  const periodName = periodRef?.list?.find((item) => item.id === auth?.period)?.name || "";

  const handlePrintPPTX = async () => {
    const ppt = new pptxgen();
    const rowsPerSlide = 2;

    ppt.defineSlideMaster({
      title: "MASTER_SLIDE",
      background: { color: "FFFFFF" },
      objects: [
        { 
          line: { 
            x: 1, 
            y: 1, 
            w: 6.9,
            h:0, 
            line: { 
              color: "005FAC", 
              width: 6 
            },
          } 
        },
        { 
          line: { 
            x: 8, 
            y: 1, 
            w: 0.7,
            h:0,
            line: { 
              color: "FCB813", 
              width: 6 
            } 
          } 
        },
        { rect: { x: 9.37, y: 5.2, w: 0.37, h: 0.43, fill: { color: "FCB813" } } },
        {
          rect: { 
            x: 7.68, 
            y: 5.2, 
            w: 1.5, 
            h: 0.43, 
            fill: { color: "005FAC" } 
          },  
        },
        {
          text: { 
            text: "Kanwil DJPb Sumatera Barat", 
            options: { 
              x: 7.68, 
              y: 5.2, 
              w: 1.5, 
              h: 0.43, 
              fontSize: 8, 
              color: "FFFFFF", 
              align: "center" 
            } 
          },
        },
        {
          text: {
            text: "Permasalahan",
            options: {
              x: 1.12,
              y: 0.21,
              w: 7.66,
              h: 0.67,
              fontFace: "Calibri",
              fontSize: 28,
              color: "005FAC",
              bold: true,  // Set the title text to bold
              align: "center",
            },
          },
        },
        { image: { x: 0.21, y: 0.21, w: 0.78, h: 0.73, path: "/logo/kemenkeu.png" } },
        { image: { x: 9, y: 0.21, w: 0.78, h: 0.73, path: "/logo/djpb.png" } },
      ],
      slideNumber: {
        x: 9.4,
        y: 5.3,
        color: "FFFFFF",
        fontSize: 9,
      },
    });
     
  
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
  
    const chunks = [];
    for (let i = 0; i < dataRows.length; i += rowsPerSlide) {
      chunks.push(dataRows.slice(i, i + rowsPerSlide));
    }


  chunks.forEach((chunk) => {
    const slide = ppt.addSlide({ masterName: 'MASTER_SLIDE' });
    const tableData = [headerRow, ...chunk];

    const tableOptions = {
      x: 0.2,
      y: 1.1,
      w: 9.5,
      border: { pt: 1, color: "FFFFFF" },
      colW: [0.5, 1.1, 2.05, 2.1, 1.9, 1, 0.9] 
    };

    slide.addTable(tableData, tableOptions);
  });

  ppt.writeFile();
  };
  
  const sectionedMatrix: SectionedMatrixType[] = matrix?.map((item: MatrixWithWsJunctionType) => {
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

  const excelMatrix = useExcelMatrix(flattenedMatrix, kppnName, periodName);
  
  return(
    <>
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
          onClick={() => excelMatrix.generate()}
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

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
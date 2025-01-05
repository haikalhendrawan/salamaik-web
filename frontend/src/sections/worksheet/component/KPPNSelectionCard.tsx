/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import {useState} from 'react';
import { Link } from "react-router-dom";
import ExcelJS from 'exceljs';
import useAxiosJWT from '../../../hooks/useAxiosJWT';
// @mui
import {Card, Box, CardHeader, Grow, Button,  Grid,  Skeleton, Stack, Typography, Tooltip, IconButton} from '@mui/material';
import Iconify from '../../../components/iconify';
import { WsJunctionType } from '../types';
import useDictionary from '../../../hooks/useDictionary';
import { useAuth } from '../../../hooks/useAuth';
import { MatrixScoreAndProgressType } from '../../matrix/types';
// -----------------------------------------------------------------------
interface KPPNSelectionCardProps{
  header: string;
  lastUpdate: string;
  image: string;
  link: string;
  percentKanwil: number;
  percentKPPN: number;
  kppnId: string;
};

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
// -----------------------------------------------------------------------
export default function KPPNSelectionCard({header, image, link, percentKanwil, percentKPPN, kppnId}: KPPNSelectionCardProps){
  const [imageLoaded, setImageLoaded] = useState(false);

  const axiosJWT = useAxiosJWT();

  const {komponenRef, subKomponenRef} = useDictionary();

  const {auth} = useAuth();

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const subheader = (
    <Stack direction='row' spacing={1}> 
      <Typography variant='body3'>{percentKanwil?.toFixed(0)?.toString() + '% complete'}</Typography>
      <Tooltip title={`Progress pengisian mandiri oleh KPPN: ${percentKPPN.toFixed()}%`}>
        <Iconify icon={"solar:info-circle-bold-duotone"}  sx={{borderRadius:'50%', cursor: 'pointer'}} />
      </Tooltip> 
    </Stack>
  );

  async function handleGenerateExcel() {
    try {
      const response = await axiosJWT.get(
        `/getWsJunctionByWorksheetForKanwil?kppn=${kppnId}&time=${new Date().getTime()}`
      );
      const response2 = await axiosJWT.post(`/getWsJunctionScoreAndProgress`, {kppnId, period: auth?.period});

      const rows = response.data.rows;
      const matrixScore = response2.data.rows;

      await produceExcel(rows, matrixScore, komponenRef, subKomponenRef);
    } catch (error) {
      console.error("Error generating Excel:", error);
    }
  };
  

  return(
    <Grow in>
      <Card>
        <Grid container spacing={0}>
        
          <Grid item xs={6}>
            <CardHeader title={header}  subheader={subheader} titleTypographyProps={{variant:'subtitle1'}} /> 
            <Box sx={{ p: 3, pb: 2 }} dir="ltr">
              <Grid container direction="row" sx={{ mt:12, justifyContent: 'space-between' }}>
                <Button 
                  variant='contained'
                  color='primary'
                  endIcon={<Iconify icon="solar:book-2-bold-duotone" />}
                  component={Link} 
                  to={link}
                >
                  Open
                </Button>
                <Tooltip title="export excel">
                  <IconButton onClick={handleGenerateExcel}>
                    <Iconify icon="vscode-icons:file-type-excel"/>
                  </IconButton>
                </Tooltip> 
                {/* <Tooltip title={lastUpdate}>
                  {lastUpdate?
                  <IconButton disableRipple><Iconify icon={"solar:check-circle-bold"}  sx={{borderRadius:'50%', color: 'rgb(0, 167, 111)' }} /></IconButton>
                  :<IconButton disableRipple sx={{display:'none'}}><Iconify icon={"solar:check-circle-bold"} sx={{borderRadius:'50%'}} /></IconButton>}
                </Tooltip>  */}
              </Grid>                      
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ overflow:'hidden', pl:0, pt:3, pr:2, pb: 2, display:'flex', height:'100%', width:'100%', background:'cover', alignContent: 'center', alignItems: 'center'}}>
            {
              imageLoaded
              ? null
              :<Skeleton variant="rounded" sx={{position:'absolute', width:'250px', height:'220px'}} />
            }
            <img 
              src={`/image/${image}`} 
              style={{ height:'220px', width: '100%', borderRadius:'12px'}} 
              onLoad={handleImageLoad}
            />
            </Box>
          </Grid>

        </Grid>
      </Card>
    </Grow>
  )
}


// -------------------------------------------------------------------------------------------------------------------------------------------
const produceExcel = async (rows: WsJunctionType[], matrixScore: MatrixScoreAndProgressType, komponenRef: KomponenRefType[] | null, subKomponenRef: SubKomponenRefType[] | null) => {
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

    sheetNilai.mergeCells("A1:G1");
    sheetNilai.getCell("A1").value = "Nilai Berdasarkan Penilaian Kanwil"; 
    sheetNilai.getCell("A1").alignment = { horizontal: "center" }; 
    sheetNilai.getCell("A1").font = { bold: true, size: 12 }; 
    sheetNilai.getColumn("D").width = 20;
    sheetNilai.getRow(1).height = 34;

    sheetNilai.getRow(2).values = columnConfig2.map((col) => col.header);

    matrixScore.scorePerKomponen.forEach((item, index) => {
      sheetNilai.addRow({
        no: index + 1,
        komponen: item.komponenTitle,
        total: item.totalNilai,
        pembagi: item.bilanganPembagi,
        avg: item.avgPerKomponen,
        bobot: `${item.komponenBobot}%`,
        weighted_avg: item.weightedScore,
      });
    });

    sheetNilai.getRow(8).values = ["", "Nilai Akhir", "", "", "", "", matrixScore.scoreByKanwil];


    // 6a. Nilai KPPN
    sheetNilai.mergeCells("A10:G10");
    sheetNilai.getCell("A10").value = "Nilai Berdasarkan Penilaian Self Assessment KPPN"; 
    sheetNilai.getCell("A10").alignment = { horizontal: "center" }; 
    sheetNilai.getCell("A10").font = { bold: true, size: 12 }; 
    sheetNilai.getRow(10).height = 34;

    sheetNilai.getRow(11).values = columnConfig2.map((col) => col.header);

    matrixScore.scorePerKomponenKPPN.forEach((item, index) => {
      sheetNilai.addRow({
        no: index + 1,
        komponen: item.komponenTitle,
        total: item.totalNilai,
        pembagi: item.bilanganPembagi,
        avg: item.avgPerKomponen,
        bobot: `${item.komponenBobot}%`,
        weighted_avg: item.weightedScore,
      });
    });

    sheetNilai.getRow(17).values = ["", "Nilai Akhir", "", "", "", "", matrixScore.scoreByKPPN];
  
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
    console.error(err)
  }

}
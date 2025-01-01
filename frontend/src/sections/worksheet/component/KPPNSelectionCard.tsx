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
      const rows = response.data.rows;

      await produceExcel(rows, komponenRef, subKomponenRef);
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
const produceExcel = async (rows: WsJunctionType[], komponenRef: KomponenRefType[] | null, subKomponenRef: SubKomponenRefType[] | null) => {
  try{
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Checklist");
  
    // 1. Define columns with keys, headers, and widths
    const columnConfig = [
      { key: "no", header: "No", width: 10 },
      { key: "checklist", header: "Checklist", width: 90 },
      { key: "kppn_score", header: "Nilai KPPN", width: 10 },
      { key: "kanwil_score", header: "Nilai Kanwil", width: 10 },
      { key: "kanwil_note", header: "Catatan Kanwil", width: 30 },
      { key: "excluded", header: "Excluded", width: 10 },
      { key: "last_update", header: "Last Update", width: 15 },
      { key: "updated_by", header: "Updated By", width: 15 },
      { key: "komponen", header: "Komponen", width: 15 },
      { key: "subkomponen", header: "Subkomponen", width: 15 },
      { key: "bobot", header: "Bobot", width: 15 },
    ];
  
    // 2. Set worksheet columns
    worksheet.columns = columnConfig;
  
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
  
      const addedRow = worksheet.addRow({
        no: row.checklist_id,
        checklist: { richText: checklistText },
        kppn_score: row.kppn_score || "",
        kanwil_score: row.kanwil_score || "",
        kanwil_note: row.kanwil_note || "",
        excluded: row.excluded === 1 ? "Y" : "N",
        last_update: row.last_update ? new Date(row.last_update).toLocaleString("en-GB"): "",
        updated_by: row.updated_by || "",
        komponen: komponenRef?.find((komponen) => komponen.id === row.komponen_id)?.title || '',
        subkomponen: subKomponenRef?.find((subKomponen) => subKomponen.id === row.subkomponen_id)?.title || '',
        bobot: `${komponenRef?.find((komponen) => komponen.id === row.komponen_id)?.bobot}%`,
      });

      if (row.excluded === 1) {
        addedRow.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D3D3D3" }, // Grey color
          };
        });
      }
    });
  
    // 4. Apply alignment styles
    worksheet.columns.forEach((column) => {
      worksheet.getColumn(column.key as string).alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
    });
    
    // 5. Set row height
    worksheet.eachRow((row, rowIndex) => {
      row.height = 100;
      if (rowIndex > 1) { 
        row.height = 170;
        const cell = row.getCell('B'); 
        cell.alignment = { vertical: 'top', horizontal: 'justify', wrapText: true };
      }
    });
  
    // 6. Generate Excel file
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
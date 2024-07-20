import {useState, useRef} from "react";
import axios from "axios";
import { Stack, Typography, Grid, Card, CardHeader, Select, MenuItem,
          FormControl, TextField, Grow, Divider} from '@mui/material';
import {useTheme, styled} from '@mui/material/styles';
import Head from "./Head";
import Kriteria from "./Kriteria";
import Dokumen from "./Dokumen";
import Nilai from "./Nilai";
import Catatan from "./Catatan";
// ------------------------------------------------------------
const selectKondisi = [
  {jenis:'Sesuai', value:2, color:'success'}, 
  {jenis:'Belum Sesuai', value:1, color:'error'},
  {jenis:'Tidak Tahu', value:0, color:'warning'},
  ];

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface WorksheetCardProps{
  id: number,
  title: string | null,
  description: string | null,
  num: number | string,
  dateUpdated: Date,
  modalOpen: () => void,
  modalClose: () => void,
  file: string | undefined,
  openInstruction: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
};

// ------------------------------------------------------------
export default function WorksheetCard(props: WorksheetCardProps) {
  const theme = useTheme();

  const addFileRef = useRef<HTMLInputElement>(null);

  const openUploadFile = () => {
    addFileRef.current? addFileRef.current.click() : null
  };

  return(
    <Grow in>
      <Grid item xs={12} sm={12} md={12}>
        <Card sx={{minHeight:'300px'}}>
          <CardHeader 
            title={<Head num={props.num} title={props.title || ""} dateUpdated={props.dateUpdated} />} 
            sx={{backgroundColor:theme.palette.background.default, color:theme.palette.text.primary,  height:'67px', pl:1, pt:0}}
          /> 

            <Grid container sx={{mt:1, mb:1, textAlign:'center', justifyContent:'center', color:theme.palette.text.secondary}} spacing={0}>  {/* Kepala Table */}
                <Grid item xs={6}>
                    <Typography variant="body2" sx={{mr:1}}> Kriteria </Typography>
                </Grid>

                <Grid item xs={1.5}>
                    <Typography variant="body2"> Dokumen </Typography>
                </Grid>

                <Grid item xs={1.5}>
                    <Typography variant="body2"> Nilai</Typography>
                </Grid>

                <Grid item xs={3}>
                    <Typography variant="body2"> Catatan Kanwil </Typography>
                </Grid>
            </Grid>

            <Divider  flexItem/>  

            <Grid container sx={{mt:0, maxHeight:'160px', textAlign:'center',  justifyContent:'center'}} spacing={1}>  {/* Table Body */}
                <Grid item xs={6} >
                  <Kriteria description={props.description || ""} />
                </Grid>

                <Grid item xs={1.5}> 
                  <Dokumen modalOpen={props.modalOpen} openUploadFile={openUploadFile} openInstruction={props.openInstruction} />
                </Grid>

                <Grid item xs={1.5} > 
                  <Nilai />
                </Grid>

                <Grid item xs={3}>  
                  <Catatan />
                </Grid>
            </Grid>

            <Divider sx={{ borderStyle: 'dashed', mt: 3 }}/>

        </Card>
      </Grid> 
    </Grow>
      
      ) 
}


// ------------------------------------------------------------------------------------------------------



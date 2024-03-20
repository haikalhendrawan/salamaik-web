  import {useState, useRef} from "react";
  import axios from "axios";
  import { Container, Stack, Typography, Grid, Card, CardHeader, IconButton, Tooltip, Select, MenuItem, InputLabel,
            FormControl, TextField, Button, Divider,CardContent, Box} from '@mui/material';
  import {useTheme, styled} from '@mui/material/styles';
  import Iconify from "../../../components/iconify";
  import Label from "../../../components/label";
  import Scrollbar from "../../../components/scrollbar/Scrollbar";

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
    title: string,
    description: string,
    num: number | string,
    dateUpdated: Date
  }

  interface HeadPropInterface{
    num: number | string,
    title:string,
    dateUpdated: Date
  }
  // ------------------------------------------------------------
  function WorksheetCard(props: WorksheetCardProps) {
    const theme = useTheme();
    const [value, setValue] = useState<string>('');
    const [selectValue, setSelectValue] = useState<number>(0);
    const [selectValue2, setSelectValue2] = useState<number>(1);



    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValue(event.target.value)
    }


    return(
        <Grid item xs={12} sm={12} md={12}>
          <Card sx={{minHeight:'300px'}}>
              <CardHeader title={<Head num={props.num} title={props.title} dateUpdated={props.dateUpdated} />} sx={{backgroundColor:theme.palette.background.default, color:theme.palette.text.primary,  height:'67px', pl:1, pt:0}}/> 

                <Grid container sx={{mt:1, mb:1, textAlign:'center', justifyContent:'center', color:theme.palette.text.secondary}} spacing={0}>  {/* Kepala Table */}
                    <Grid item xs={5}>
                        <Typography variant="body2" sx={{mr:1}}> Kriteria </Typography>
                    </Grid>

                    <Grid item xs={1.5}>
                        <Typography variant="body2"> Nilai KPPN </Typography>
                    </Grid>

                    <Grid item xs={1.5}>
                        <Typography variant="body2"> Nilai Kanwil </Typography>
                    </Grid>

                    <Grid item xs={3.5}>
                        <Typography variant="body2"> Catatan Kanwil </Typography>
                    </Grid>
                </Grid>

                <Divider  flexItem/>  

                <Grid container sx={{mt:0, maxHeight:'160px', textAlign:'center',  justifyContent:'center'}} spacing={1}>  {/* Table Body */}
                    <Grid item xs={5} >
                      <Scrollbar  sx={{
                        height: 140,
                        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
                      }}>
                        <Box>
                          <Typography variant="body2" sx={{mr:1, fontSize:12}} dangerouslySetInnerHTML={{__html:props.description}}/>
                        </Box> 
                      </Scrollbar>
                    </Grid>

                    <Grid item xs={1.5}> 
                        <FormControl sx={{width:'100%', height:'100%'}}>
                          <Select required name="kondisi" value={selectValue}  size='small' sx={{typography:'body2', fontSize:12}}>
                            <MenuItem key={0} sx={{fontSize:12}} value={0}>10</MenuItem>
                            <MenuItem key={1} sx={{fontSize:12}} value={1}>5</MenuItem>
                            <MenuItem key={2} sx={{fontSize:12}} value={2}>0</MenuItem>
                          </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={1.5}>     
                        <FormControl sx={{width:'100%', height:'100%'}}>
                          <Select required name="kondisi" value={selectValue2}  size='small' sx={{typography:'body2', fontSize:12}}>
                            <MenuItem key={0} sx={{fontSize:12}} value={0}>10</MenuItem>
                            <MenuItem key={1} sx={{fontSize:12}} value={1}>5</MenuItem>
                            <MenuItem key={2} sx={{fontSize:12}} value={2}>0</MenuItem>
                          </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={3.5}>  
                        <FormControl sx={{width:'100%', height:'100%'}}>
                          <TextField name="catatankppn" size='small' value={value} onChange={handleChange} multiline minRows={4} maxRows={4}  inputProps={{sx: {fontSize: 12}, spellCheck: false,}} />
                        </FormControl>
                    </Grid>
                </Grid>

                <Divider sx={{ borderStyle: 'dashed', mt:2 }}/>

          </Card>
        </Grid> 
        ) 
  }

  const Head = (props: HeadPropInterface) => {  // bagian atas dari masing2 tabel gambar dan nama user
    const date = new Date(props.dateUpdated).toLocaleDateString('en-GB');
    const tooltipText = `Last update: ${date}`;
    const isUpdate = props.dateUpdated;
    const theme = useTheme();

    return(
    <>
    <Stack direction="row" spacing={2} sx={{justifyContent:'space-between'}}>
        <Stack direction="row" spacing={1} sx={{alignItems:'center'}}>
            <Typography variant="h6" sx={{ml:1, fontSize:14}}>{`${props.num}`}</Typography>
            <Stack >
                <Typography variant="body1" sx={{fontSize:15, ml:1}}>{props.title}</Typography>
            </Stack>
        </Stack>
        {isUpdate?
          <Tooltip title={tooltipText} placement="left-start">
            <IconButton disableRipple><Iconify icon={"icons8:checked"} sx={{color:'rgb(0, 167, 111)', borderRadius:'50%'}} /></IconButton>
          </Tooltip>:
          null
        }

    </Stack>
    </>
    )
  }

  export default WorksheetCard;
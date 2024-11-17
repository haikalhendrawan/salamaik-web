import { useEffect, useState } from 'react';
import {Card, Typography, Grid, FormControl, CardContent, Stack, Button, SelectChangeEvent} from '@mui/material';
import { StyledSelect, StyledSelectLabel, StyledMenuItem } from '../../../components/styledSelect';
import useAxiosJWT from '../../../hooks/useAxiosJWT';
import useDictionary from '../../../hooks/useDictionary';
import WorksheetCard from './component/WorksheetCard/WorksheetCard';
import Iconify from '../../../components/iconify';
import PreviewFileModal from './component/PreviewFileModal';
import { WsJunctionType } from './types';
// ------------------------------------------------------------------------------------------------------
interface ChecklistProps {
  selectedUnit: string;
  selectedPeriod: number;
  selectedData: number;
}

// ------------------------------------------------------------------------------------------------------

export default function Checklist({selectedUnit, selectedPeriod}: ChecklistProps) {
  const axiosJWT = useAxiosJWT();

  const { periodRef } = useDictionary();

  const [compare, setCompare] = useState<boolean>(false);

  const [wsJunction, setWsJunction] = useState<WsJunctionType[] | []>([]);

  const isPeriod1Selected = selectedPeriod !== 0;

  const [selectedJunctionId, setSelectedJunctionId] = useState<number>(0);

  const selectedWsJunction = wsJunction?.find((item: WsJunctionType) => item.id === selectedJunctionId);

  const isWsJunctionSelected = selectedJunctionId>0;

  const [wsJunctionAlt, setWsJunctionAlt] = useState<WsJunctionType[] | []>([]);

  const [selectedPeriodAlt, setSelectedPeriodAlt] = useState<number>(0);

  const isPeriodAltSelected= selectedPeriodAlt !== 0;

  const [selectedJunctionAltId, setSelectedJunctionAltId] = useState<number>(0);

  const selectedWsJunctionAlt = wsJunctionAlt?.find((item: WsJunctionType) => item.id === selectedJunctionAltId);

  const isWsJunctionAltSelected = selectedJunctionAltId>0;

  const handleChecklistChange = (e: SelectChangeEvent<unknown>) => {
    setSelectedJunctionId(Number(e.target.value));
  };

  const getWsJunction = async () => {
    try {
      const currentPeriod = selectedPeriod;
      const response = await axiosJWT.get(`/getByPeriodAndKPPN?kppn=${selectedUnit}&period=${currentPeriod}`);
      setWsJunction(response.data.rows);
    } catch (error) {
      setWsJunction([]);
      console.error(error);
    }
  };

  const handlePeriodAltChange = (e: SelectChangeEvent<unknown>) => {
    if(e.target.value === ""){
      setSelectedPeriodAlt(0);
    }else{
      setSelectedPeriodAlt(Number(e.target.value));
    }
  };

  const handleChecklistAltChange = (e: SelectChangeEvent<unknown>) => {
    setSelectedJunctionAltId(Number(e.target.value));
  };

  const handleChangeCompare = () => {
    setCompare(!compare);
    if(!compare == true){
      window.scrollTo({
        top: 500,
        behavior: "smooth"
      });
    }else{
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }

  const getWsJunctionAlt = async () => {
    try {
      const response = await axiosJWT.get(`/getByPeriodAndKPPN?kppn=${selectedUnit}&period=${selectedPeriodAlt}`);
      setWsJunctionAlt(response.data.rows);
    } catch (error) {
      setWsJunctionAlt([]);
      console.error(error);
    }
  };

  useEffect(() => {
    if(!isPeriod1Selected || selectedPeriod === 0) return;
    getWsJunction();
  }, [selectedPeriod]);

  useEffect(() => {
    if(!isPeriodAltSelected || selectedPeriodAlt === 0) return;
    getWsJunctionAlt();
  }, [selectedPeriodAlt]);

  return (
    <Card>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={12} textAlign={'center'}>
            <Typography variant="h6">Data Checklist Kertas Kerja</Typography>
          </Grid>
          <Grid item xs={12} md={12} textAlign={'center'}>
            <Stack direction={'row'} justifyContent={'start'} spacing={2} marginBottom={2} alignItems={'center'}>
              <FormControl sx={{width: '80%', display: isPeriod1Selected ? 'flex' : 'none'}} size='small' >
                <StyledSelectLabel id="checklist1-selection-label">Checklist Kertas Kerja</StyledSelectLabel>
                <StyledSelect 
                  labelId="checklist1-selection-label"
                  label="Checklist Kertas Kerja" 
                  id="checklist1-selection" 
                  name="checklist1-selection"
                  defaultValue={0}
                  onChange={(e) => handleChecklistChange(e)}
                  MenuProps={
                    {
                      sx: {maxWidth: '300px', maxHeight: '400px'},

                    }
                  }
                >
                  <StyledMenuItem key={0} value={0}>-None-</StyledMenuItem>
                  {
                    wsJunction?.map((item: WsJunctionType, index) => (
                      <StyledMenuItem key={index+1} value={item.id}>{index+1}. {item.title}</StyledMenuItem>
                    ))
                  }
                </StyledSelect>
              </FormControl>
            </Stack>
            <Stack direction={'column'} justifyContent={'start'} spacing={2} sx={{display: isWsJunctionSelected ? 'flex' : 'none'}}>
              <WorksheetCard modalClose={() => {}} modalOpen={() => {}} wsJunction={selectedWsJunction || null} wsDetail={null}/>
              <div>
                <Button 
                  fullWidth={false} 
                  variant='contained' 
                  endIcon={!compare?<Iconify icon={'eva:arrow-down-fill'} />:<Iconify icon={'eva:arrow-up-fill'} />}
                  onClick={handleChangeCompare}
                  color={"primary"}
                >
                  {"Bandingkan"}
                </Button>
              </div>
              <PreviewFileModal />
            </Stack>

          </Grid>
          <Grid item xs={12} md={12} textAlign={'center'} sx={{display: compare ? 'block' : 'none'}}> 
            <Stack direction={'row'} justifyContent={'start'} spacing={2} marginBottom={2} alignItems={'center'}> 
              <FormControl sx={{width: '50%'}} size='small'>
                <StyledSelectLabel id="period1-selection-label">Periode Pembanding</StyledSelectLabel>
                <StyledSelect 
                  labelId="period2-selection-label"
                  id="period2-selection" 
                  name="period2-selection"
                  label="Periode Pembanding" 
                  defaultValue={""}
                  value={selectedPeriodAlt}
                  onChange = {(e) => handlePeriodAltChange(e)}
                >
                  {
                    periodRef?.list?.map((item: any, index: number) => (
                      <StyledMenuItem key={index} value={item.id}>{item.name}</StyledMenuItem>
                    ))
                  }
                </StyledSelect>
              </FormControl>
              
              <FormControl sx={{width: '80%'}} size='small' >
                <StyledSelectLabel id="checklist2-selection-label">Checklist Kertas Kerja</StyledSelectLabel>
                <StyledSelect 
                  labelId="checklist2-selection-label"
                  label="Checklist Kertas Kerja" 
                  id="checklist2-selection" 
                  name="checklist2-selection"
                  defaultValue={""}
                  onChange={(e) => handleChecklistAltChange(e)}
                  MenuProps={
                    {
                      sx: {maxWidth: '300px', maxHeight: '400px'},

                    }
                  }
                >
                  <StyledMenuItem key={0} value={0}>-None-</StyledMenuItem>
                  {
                    wsJunctionAlt?.map((item: any, index) => (
                      <StyledMenuItem key={index} value={item.id}>{index+1}. {item.title}</StyledMenuItem>
                    ))
                  }
                </StyledSelect>
              </FormControl>
            </Stack>
            <Stack direction={'column'} justifyContent={'start'} sx={{display: isWsJunctionAltSelected ? 'flex' : 'none'}}>
              <WorksheetCard modalClose={() => {}} modalOpen={() => {}} wsJunction={selectedWsJunctionAlt || null} wsDetail={null}/>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

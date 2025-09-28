/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { useEffect, useState } from "react";
import StandardizationTable from "./components/StandardizationTable";
import useStandardization from "./useStandardization";
import usePreviewFileModal from "./usePreviewFileModal";
import PreviewFileModal from "./components/PreviewFileModal";
import { Stack, Card, CardContent, Typography, FormControl } from "@mui/material";
import { StyledSelect, StyledMenuItem, StyledSelectLabel } from "../../../components/styledSelect";
import PageLoading from "../../../components/pageLoading";
import useDictionary from "../../../hooks/useDictionary";
import { clusterize } from "../../standardization/utils";
// --------------------------------------------------------------

interface StandardizationProps{
  selectedUnit: string,
  selectedPeriod: number,
  selectedData: number
}
// --------------------------------------------------------------
export default function Standardization({selectedUnit, selectedPeriod, selectedData}:StandardizationProps) {
  const [loading, setLoading] = useState(true);

  const {open, modalOpen, modalClose, file} = usePreviewFileModal();

  const {getStandardization, standardization, dasar, selectedDasar, setSelectedDasar} = useStandardization();

  const clusteredStandardization = clusterize(standardization);

    const { periodRef, kppnRef } = useDictionary();

  const unitString = kppnRef?.list.filter((item) => item.id === selectedUnit)?.[0]?.alias || '';

  const periodString = periodRef?.list.filter((item) => item.id === selectedPeriod)?.[0]?.name || '';

  const handleChangeDasar = (e: any) => {
    setSelectedDasar(e.target.value as string);
    getStandardization(selectedUnit, e.target.value);
  };

  useEffect(() => {
    async function getData(){
      try{
        await getStandardization(selectedUnit, selectedPeriod);
        setLoading(false);
      }catch(err){
        setLoading(false);
      }
    }

    setLoading(true);
    getData();

  }, [selectedUnit, selectedPeriod, selectedData]);

  return (
    <>
      <Card>
        <CardContent>
          <Stack alignContent={'center'} textAlign={'center'}>
            <Typography variant='h6'>{`Data Standardisasi`} </Typography>
            <Typography variant='body3'>{`${unitString}, Periode ${periodString}`} </Typography>
          </Stack>
        </CardContent>
      </Card>
      <Stack direction='column' spacing={4} marginTop={4}>
        {loading
          ?<PageLoading duration={2}/>
          : <>
              <FormControl style={{width:'30%'}}>
                <StyledSelectLabel id="dasar-select-label">Dasar</StyledSelectLabel>
                <StyledSelect
                  name="dasar"
                  label="Dasar"
                  labelId="dasar-select-label"
                  size="small"
                  value={selectedDasar}
                  onChange={handleChangeDasar}
                  defaultValue={selectedDasar}
                >
                  {dasar?.map(item => <StyledMenuItem value={item.id}>{item.dasar}</StyledMenuItem>)}
                </StyledSelect>
              </FormControl>
              {
                clusteredStandardization?.map((item, index) => (
                  <StandardizationTable 
                    header={item.cluster_name} 
                    modalOpen={modalOpen} 
                    kppnTab={selectedUnit} 
                    cluster={item.cluster}
                    key={index} 
                  />
                ))
              }
            </>
        }
      </Stack>
      <PreviewFileModal open={open} modalClose={modalClose} file={file} kppnId={selectedUnit} />
    </>
  )
}

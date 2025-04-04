/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { useEffect, useState } from "react";
import StandardizationTable from "./components/StandardizationTable";
import useStandardization from "./useStandardization";
import usePreviewFileModal from "./usePreviewFileModal";
import PreviewFileModal from "./components/PreviewFileModal";
import { Stack, Card, CardContent, Typography } from "@mui/material";
import PageLoading from "../../../components/pageLoading";
import useDictionary from "../../../hooks/useDictionary";
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

  const {getStandardization} = useStandardization();

    const { periodRef, kppnRef } = useDictionary();

  const unitString = kppnRef?.list.filter((item) => item.id === selectedUnit)?.[0]?.alias || '';

  const periodString = periodRef?.list.filter((item) => item.id === selectedPeriod)?.[0]?.name || '';

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
              <StandardizationTable 
                header={'Manajemen Eksternal'} 
                modalOpen={modalOpen} 
                kppnTab={selectedUnit}
                cluster={1} 
              />
              <StandardizationTable 
                header={'Penguatan Kapasitas Perbendaharaan'} 
                modalOpen={modalOpen} 
                kppnTab={selectedUnit} 
                cluster={2} 
              />
              <StandardizationTable 
                header={'Penguatan Manajemen Internal'} 
                modalOpen={modalOpen} 
                kppnTab={selectedUnit}
                cluster={3}  
              />
            </>
        }
      </Stack>
      <PreviewFileModal open={open} modalClose={modalClose} file={file} kppnId={selectedUnit} />
    </>
  )
}

import {useMemo} from "react";
import { Document, Page, Text, View, Image, Font} from '@react-pdf/renderer';
import styles from "../styles";
import { StandardizationType } from "../../standardization/types";
import StdKPPNReportTable from "./StdKPPNReportTable";

// ----------------------------------------------------------------

Font.registerHyphenationCallback(word => [word]);

interface StdKPPNReportPDFProps{
  period: number | null | undefined,
  periodRef: any,
  standardization: StandardizationType[] | [],
  unitName: string,
  kppn?: string
};
// -------------------------------------------------------------

export default function StdKPPNReportPDF({period, periodRef, standardization, unitName, kppn}: StdKPPNReportPDFProps) {

  const isEvenPeriod = periodRef?.list?.filter((item: any) => item.id === period)?.[0]?.evenPeriod || 0;

  const currentDate = new Date();
  const date = currentDate.getDate();
  const month = currentDate.getMonth()+1;
  const year = currentDate.getFullYear();
  const hour = currentDate.getHours().toString().padStart(2, '0');
  const minute = currentDate.getMinutes().toString().padStart(2, '0');
  let second = currentDate.getSeconds().toString().padStart(2, '0');
  const PDF_TITLE_DATE = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }) || '';
  const requireTTE = kppn==='03010'?true:false;

  const cluster1 = useMemo(() => standardization?.filter((item) => item.cluster === 1), [standardization]);
  const cluster2 = useMemo(() => standardization?.filter((item) => item.cluster === 2), [standardization]);
  const cluster3 = useMemo(() => standardization?.filter((item) => item.cluster === 3), [standardization]);

  return(
    <>
      <Document>
        <Page size="A4" style={styles.page} orientation="landscape">
          <View style={styles.header} fixed wrap={false}>
              <View style={{flexDirection:'column', justifyContent:'center', alignItems:'center', paddingTop:15, paddingBottom:15}}>
                <Text style={{fontFamily: 'Helvetica-Bold', textAlign:'center', fontSize: 14, marginBottom:3}}>
                  Monitoring Standardisasi Penguatan dan Pengembangan Peran KPPN 
                </Text>
                <Text style={{fontFamily: 'Helvetica-Bold', textAlign:'center', fontSize: 14, marginBottom:3}}>
                  {unitName} 
                </Text>
                <Text style={{fontSize: 12, textAlign:'center', marginBottom:3}}> {PDF_TITLE_DATE} </Text>
              </View>
          </View>

          <StdKPPNReportTable 
            title="Manajemen Eksternal" 
            isEvenPeriod={isEvenPeriod} 
            standardizationFilter={cluster1}
          />

          <StdKPPNReportTable 
            title="Penguatan Kapasitas Perbendaharaan" 
            isEvenPeriod={isEvenPeriod} 
            standardizationFilter={cluster2}
          />

          <StdKPPNReportTable 
            title="Penguatan Manajemen Internal" 
            isEvenPeriod={isEvenPeriod} 
            standardizationFilter={cluster3}
          />

          {requireTTE && 
            <View style={{...styles.tte, marginTop:0, display:'flex'}} wrap={false}>
              <View style={{width:'100%'}}>
                <Text style={styles.tteText}>Kepala Bidang Supervisi KPPN dan Kepatuhan Internal</Text>
              </View>
              <View style={styles.tteBox} />
              <View style={{width:'100%'}}>
                <Text style={{...styles.tteText, color:'#59606b'}}>Ditandatangani secara elektronik</Text>
              </View>
              <View style={{width:'100%'}}>
                <Text style={styles.tteText}>{'Irfan Huzairin'}</Text>
              </View>
            </View>
          }


          <View style={styles.footer} fixed>
            <Text style={{fontSize:8}}>
              Di generate pada: {currentDate && `${date}-${month}-${year} ${hour}:${minute}:${second}`}
            </Text>
            <Image style={styles.logo} src={"/logo/salamaik-short.png"}/>
            <Text style={{ textAlign: 'center', marginLeft:200}} render={({ pageNumber, totalPages }) => (
              `Hal: ${pageNumber} dari ${totalPages} halaman`
            )} />
          </View>

        </Page>



      </Document>
    
    </>
  )
}
import { Text, View, Font} from '@react-pdf/renderer';
import styles from "../styles";
import { StandardizationType } from "../../standardization/types";
// ----------------------------------------------------------------

Font.registerHyphenationCallback(word => [word]);

const INTERVAL_DESC = [
  "Minimal 1x tiap Bulan",
  "Minimal 2x tiap Bulan",
  "Minimal 4x tiap Bulan",
  "Minimal 20x tiap Bulan",
  "Minimal 1x tiap Triwulan",
  "Minimal 2x tiap Triwulan"
];

interface StdKPPNReportTableProps{
  title: string,
  isEvenPeriod: number,
  standardizationFilter: StandardizationType[] | []
};
// ---------------------------------------------------------------------------------------------------------------
export default function StdKPPNReportTable({title, isEvenPeriod, standardizationFilter}: StdKPPNReportTableProps) {
  const reportingDate = 15;

  return(
    <>
      <Text style={{fontFamily: 'Helvetica-Bold', textAlign:'left', fontSize: 14, marginBottom:3}}>
        {`Klaster ${title}`} 
      </Text>
      <View style={styles.table}> 
        <View style={styles.tableRow} fixed> 
          <View style={{...styles.tableHead, width:'5%'}}> 
            <Text style={styles.tableHeadCell}>No</Text> 
          </View> 
          <View style={{...styles.tableHead, width:'70%'}}> 
            <Text style={styles.tableHeadCell}>Standar</Text> 
          </View>
          <View style={{...styles.tableHead}}> 
            <Text style={styles.tableHeadCell}>Periodisasi</Text> 
          </View>  
          <View style={{...styles.tableHead, width:'10%'}}> 
            <Text style={styles.tableHeadCell}>{isEvenPeriod===0?'Jan':'Jul'}</Text> 
          </View>
          <View style={{...styles.tableHead, width:'10%'}}> 
            <Text style={styles.tableHeadCell}>{isEvenPeriod===0?'Feb':'Agt'}</Text> 
          </View> 
          <View style={{...styles.tableHead, width:'10%'}}> 
            <Text style={styles.tableHeadCell}>{isEvenPeriod===0?'Mar':'Sep'}</Text> 
          </View> 
          <View style={{...styles.tableHead, width:'10%'}}> 
            <Text style={styles.tableHeadCell}>{isEvenPeriod===0?'Apr':'Okt'}</Text> 
          </View> 
          <View style={{...styles.tableHead, width:'10%'}}> 
            <Text style={styles.tableHeadCell}>{isEvenPeriod===0?'Mei':'Nov'}</Text> 
          </View> 
          <View style={{...styles.tableHead, width:'10%'}}> 
            <Text style={styles.tableHeadCell}>{isEvenPeriod===0?'Jun':'Dec'}</Text> 
          </View> 
        </View>

        {standardizationFilter?.map((row, index) => (
          <View style={styles.tableRow} key={index} wrap={false}> 
            <View style={{...styles.tableCol, width:'5%'}}> 
              <Text style={styles.tableCell}>{index+1}</Text> 
            </View> 
            <View style={{...styles.tableCol, width:'70%', paddingVertical: 2, paddingHorizontal: 1}}>
              <Text style={styles.tableCell}>{`${row.title}`}</Text> 
            </View>
            <View style={{...styles.tableCol}}> 
              <Text style={{...styles.tableCell}}>{INTERVAL_DESC[row.interval-1]}</Text> 
            </View>
            {row.short.map((value, i) => (
              <View key={i} style={{
                ...styles.tableCol, 
                width:'10%', 
                backgroundColor: getCellColor(value, i, isEvenPeriod, reportingDate)
                }}
              > 
                <Text style={{...styles.tableCell}}>{value===0?'':value}</Text> 
              </View>
            ))}
          </View>    
        ))} 
      </View>
    </>
  )
}

// ---------------------------------------------------------------------------------------------------------------
function getCellColor(value: number, index: number, isEvenPeriod: number, reportingDate: number ) {
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();

  const i = isEvenPeriod===0?index:index+6;

  if(i>currentMonth){
    return "black"
  };

  if(i===currentMonth && currentDate<reportingDate){
    return "black"
  };

  if(value===0){
    return "#54D62C"
  };

  return "transparent"
}
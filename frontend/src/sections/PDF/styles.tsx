import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      padding:20,
      paddingBottom:30
    },
    table: { 
      width: "100%", 
      borderStyle: "solid", 
      borderTopWidth: 0, 
      borderRightWidth: 0, 
      borderBottomWidth: 0,
      borderLeftWidth:0,
      marginBottom:30
    }, 
    tableRow: { 
      margin: 0, 
      borderLeftWidth:1,
      borderStyle: "solid", 
      flexDirection: "row" 
    }, 
    tableCol: { 
      width: "25%", 
      borderStyle: "solid", 
      borderWidth: 1, 
      borderLeftWidth: 0, 
      borderTopWidth: 0 ,
    }, 
    tableHead: { 
      width: "25%", 
      borderStyle: "solid", 
      borderWidth:1,
      borderLeftWidth:0,
      backgroundColor: '#f0f0f0',
      height:30,
      textAlign:'center',
      justifyContent:'center'
    }, 
    tableHeadCell: { 
      fontWeight: 700,
      fontSize:10,
      alignSelf:'center',
      justifyContent:'center',
      alignItems:'center'
    },
    tableCell: { 
      textAlign:'center', 
      marginTop: 5, 
      fontSize: 10,
      wordBreak: 'break-word',
      overflow:'hidden', 
      textOverflow: 'ellipsis'
    },
    header:{
      marginBottom:10,
      width:'auto',
      height:70,
      borderBottomWidth:1,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      alignContent:'center',
      textAlign:'center',
      gap:10
    },
    footer:{
      height:40,
      width:'100vw',
      marginTop:40,
      paddingLeft:20,
      bottom:0,
      position:'absolute',
      justifyContent:'flex-start',
      alignItems:'center',
      alignContent:'center',
      fontSize:8,
      flexDirection:'row',
    },
    title:{
      height:40,
      marginTop:0,
      width:'100%',
      justifyContent:'center',
      alignItems:'center',
      alignContent:'center',
      fontSize:14,
      fontWeight:'bold',
      flexDirection:'column'
    },
    logo:{
      height:20,
      width:20
    },
    tte:{
      width:'20%',
      position:'absolute',
      right: 50,
      bottom: 50,
      flexDirection:'column',
      justifyContent:'flex-end',
      alignItems:'flex-end',
      alignContent:'flex-end',
    },
    tteBox:{
      height:100, 
      width:'100%'
    },
    tteText:{
      fontSize: 10, 
      textAlign:'left'
    },
  });

export default styles;
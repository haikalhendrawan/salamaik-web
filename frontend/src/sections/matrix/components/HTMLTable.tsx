import styles from './HTMLTable.module.css';
import { MatrixWithWsJunctionType } from '../types';

export default function HTMLTable({matrix}:{matrix: MatrixWithWsJunctionType[]}) {
  console.log(matrix);
  return (
    <table id="html-table" style={{display:'none'}}>
    <thead>
      <tr>
        <th style={{width: '5%'}}>No</th>
        <th style={{width: '5%'}}>Komponen Supervisi</th>
        <th style={{width: '10%'}}>Hal</th>
        <th style={{width: '50%'}}>Permasalahan</th>
        <th style={{width: '35%'}}>Rekomendasi</th>
        <th style={{width: '35%'}}>Peraturan Terkait</th>
        <th style={{width: '35%'}}>UIC</th>
      </tr>
    </thead>
    <tbody>
      {
        matrix?.filter((mx) => mx.is_finding === 1).map((item, index) => (
          <tr>
            <td style={{width: '5%'}}>{index}</td>
            <td style={{width: '5%'}}>{item.komponen_string}</td>
            <td style={{width: '5%'}}>{item.checklist[0]?.title}</td>
            <td style={{width: '5%'}}>{item.permasalahan}</td>
            <td style={{width: '5%'}}>{item.rekomendasi}</td>
            <td style={{width: '5%'}}>{item.peraturan}</td>
            <td style={{width: '5%'}}>{item.uic}</td>
          </tr>
        ))
      } 
    </tbody>
  </table>
  )
}

interface StandardizationType{
  id: number;
  title: string;
  cluster: number;
  interval: number
};

interface StandardizationJunctionType{
  id: number;
  kppn_id: number;
  period_id: number;
  standardization_id: number
  month: number;
  file: string;
  uploaded_at: string
};

export function stdScoreGenerator(
  interval: number, 
  stdJunction: StandardizationJunctionType[],
  stdRef: StandardizationType,
  isEvenPeriod: number
){
  const list = [
    [...stdJunction?.filter((row) => (row.standardization_id === stdRef.id) && row.month === (isEvenPeriod===0?1:7))],
    [...stdJunction?.filter((row) => (row.standardization_id === stdRef.id) && row.month === (isEvenPeriod===0?2:8))],
    [...stdJunction?.filter((row) => (row.standardization_id === stdRef.id) && row.month === (isEvenPeriod===0?3:9))],
    [...stdJunction?.filter((row) => (row.standardization_id === stdRef.id) && row.month === (isEvenPeriod===0?4:10))],
    [...stdJunction?.filter((row) => (row.standardization_id === stdRef.id) && row.month === (isEvenPeriod===0?5:11))],
    [...stdJunction?.filter((row) => (row.standardization_id === stdRef.id) && row.month === (isEvenPeriod===0?6:12))]
  ];

  let score: number = 0;

  switch(interval){
    case 1: // bulanan (1x tiap bulan)
      list.map((item) => {
        if(item.length === 1){
          score +=2
        }
      })
      break;

    case 2: // 2 mingguan (2x tiap bulan)
      list.map((item) => {
        score += item.length
      })
      break;

    case 3: // 1 mingguan (4x tiap bulan)
      list.map((item) => {
        if(item.length>0){
          score += (item.length/2)
        }
      })
      break;

    case 4: // harian (20 hari tiap bulan)
      list.map((item) => {
        if(item.length === 1){
          score +=2
        }
      })
      break;

    case 5: // Triwulanan
      const q1Triwulanan = (list[2].length)*6;
      const q2Triwulanan = (list[5].length)*6;
      score += q1Triwulanan + q2Triwulanan
      break;

    case 6: // 2 x Tiap Triwulan
      const q1Triwulanan2 = (list[2].length)*3;
      const q2Triwulanan2 = (list[5].length)*3;
      score += q1Triwulanan2 + q2Triwulanan2
      break;

    default : score+=0
  }

  return score
}
/**
 *
 *
 * Refer to dasar hukum PER-1/PB/2023
 */

export async function sanitizeSubKomponen(komponenId: number, subKomponenId: number) {
  if(komponenId===0 || !komponenId || komponenId>4){
    return false
  };
  if(subKomponenId===0 || !subKomponenId){
    return false
  };
  switch(komponenId){
    case 1:
      const validSubkomponen = [1, 2, 3, 4, 5, 6];
      if(validSubkomponen.includes(subKomponenId) === false){
        return false
      };
      break;
    case 2:
      const validSubkomponen2 = [7, 8, 9, 10, 11];
      if(validSubkomponen2.includes(subKomponenId) === false){
        return false
      };
      break;
    case 3:
      const validSubkomponen3 = [12, 13, 14];
      if(validSubkomponen3.includes(subKomponenId) === false){
        return false
      };
      break;
    case 4:
      const validSubkomponen4 = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
      if(validSubkomponen4.includes(subKomponenId) === false){
        return false
      };
      break;
    default:
      return true
  }
  return true
}
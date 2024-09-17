/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

/**
 *
 * utk ngambil campuran state dari useThemeColor dan useThemeMode
 * value dari useMode hook ada di ../theme/index
*/
import { createContext, useContext } from 'react';


const ModeContext = createContext({});

const useMode = () => {
    return useContext(ModeContext);
}

export default useMode;
export {ModeContext};
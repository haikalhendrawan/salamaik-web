/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

/**
 *hook untuk ngambil dan nge set dark Mode di local storage
 */
import { useState } from "react";


const useThemeMode= (defaultValue: string | {}) => {
    // default value dari useStatenya bukan string tapi function yang return string
    const [localStorageValue, setLocalStorageValue] = useState(() => {
        try {
            const value = localStorage.getItem('mode')
            
            if (value) {
                return JSON.parse(value)
            } else {
                localStorage.setItem('mode', JSON.stringify(defaultValue));
                return defaultValue
            }
        } catch (error) {
            localStorage.setItem('mode', JSON.stringify(defaultValue));
            return defaultValue
        }
    })
 
    // update useStatenya seperti biasa
    const setLocalStorageStateValue = (valueOrFn: any) => {
        let newValue;
        if (typeof valueOrFn === 'function') {
            const fn = valueOrFn;
            newValue = fn(localStorageValue)
        }
        else {
            newValue = valueOrFn;
        }
        localStorage.setItem('mode', JSON.stringify(newValue));
        setLocalStorageValue(newValue)
    }
    return [localStorageValue, setLocalStorageStateValue]
}
 
export default useThemeMode;

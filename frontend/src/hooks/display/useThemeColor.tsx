/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

/**
 *
 * hook untuk ngambil dan nge set primary color di local storage
 */
import { useState } from "react";
 
const useThemeColor = (defaultValue: string | {}) => {
    // default value dari useStatenya bukan string tapi function yang return string
    const [localStorageValue, setLocalStorageValue] = useState(() => {
        try {
            const value = localStorage.getItem('color')
            
            if (value) {
                return JSON.parse(value)
            } else {
                localStorage.setItem('color', JSON.stringify(defaultValue));
                return defaultValue
            }
        } catch (error) {
            localStorage.setItem('color', JSON.stringify(defaultValue));
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
        localStorage.setItem('color', JSON.stringify(newValue));
        setLocalStorageValue(newValue)
    }
    return [localStorageValue, setLocalStorageStateValue]
}
 
export default useThemeColor;

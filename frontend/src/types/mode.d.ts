/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

interface Color{
  [key: string]:string
}

declare global{
  interface ModeType{
    mode: string,
    setMode:  (mode: string | ((prev: string) => string)) => void
    primaryColor: Color,
    setPrimaryColor: (primaryColor: Color) => void
  }
}

export {}
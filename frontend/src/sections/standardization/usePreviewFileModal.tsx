/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { ReactNode, useState, createContext, useContext} from 'react';
//------------------------------------------------------------------
interface PreviewFileModalContextType{
  open: boolean,
  file: string,
  selectedId: number,
  modalOpen: () => void,
  modalClose: () => void,
  changeFile: (file: string) => void,
  selectId: (id: number) => void
};

type PreviewFileModalProviderProps = {
  children: ReactNode
};

//------------------------------------------------------------------
const PreviewFileModalContext = createContext<PreviewFileModalContextType>({
  open: false,
  file: '',
  selectedId: 0,
  modalClose: () => {},
  modalOpen: () => {},
  changeFile: () => {},
  selectId: () => {}
});

const PreviewFileModalProvider = ({children}: PreviewFileModalProviderProps) => {
  const [open, setOpen] = useState<boolean>(false); //modal

  const [file, setFile] = useState<string >(''); //modal

  const [selectedId, setSelectedId] = useState<number>(0);

  const modalOpen = () => {   //modal
    setOpen(true);
  };

  const modalClose = () => {  //modal
    setOpen(false);
  };

  const changeFile = (file: string) => {
    setFile(file);
  };

  const selectId = (id: number) => {
    setSelectedId(id);
  };

  return(
    <PreviewFileModalContext.Provider value={{open, file, selectedId, modalOpen, modalClose, changeFile, selectId}}>
      {children}
    </PreviewFileModalContext.Provider>
  )
};

const usePreviewFileModal = (): PreviewFileModalContextType => {
  return(useContext(PreviewFileModalContext))
};

export default usePreviewFileModal;
export {PreviewFileModalProvider};
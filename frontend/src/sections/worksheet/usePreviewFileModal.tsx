import { ReactNode, useState, createContext, useContext } from 'react';
//------------------------------------------------------------------
interface PreviewFileModalContextType{
  open: boolean,
  file: string,
  selectedId: number,
  fileOption: number,
  isExampleFile: boolean,
  handleSetIsExampleFile: (isExample: boolean) => void,
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
  fileOption: 1,
  isExampleFile: false,
  handleSetIsExampleFile: () => {},
  modalClose: () => {},
  modalOpen: () => {},
  changeFile: () => {},
  selectId: () => {}
});

const PreviewFileModalProvider = ({children}: PreviewFileModalProviderProps) => {
  const [open, setOpen] = useState<boolean>(false); //modal

  const [file, setFile] = useState<string >(''); //modal

  const [selectedId, setSelectedId] = useState<number>(0);

  const [isExampleFile, setIsExampleFile] = useState<boolean>(false);

  const [fileOption, setFileOption] = useState<number>(1);

  const modalOpen = () => {   //modal
    setOpen(true);
  };

  const modalClose = () => {  //modal
    setOpen(false);
    setFile('');
    setSelectedId(0);
    setIsExampleFile(false);
    setFileOption(1);
  };

  const changeFile = (file: string) => {
    setFile(file);
  };

  const selectId = (id: number) => {
    setSelectedId(id);
  };

  const handleSetIsExampleFile = (isExampleFile: boolean) => {
    setIsExampleFile(isExampleFile);
  }

  return(
    <PreviewFileModalContext.Provider value={{
      open, 
      file, 
      selectedId, 
      fileOption, 
      isExampleFile, 
      handleSetIsExampleFile, 
      modalOpen, 
      modalClose, 
      changeFile, 
      selectId
      }}
    >
      {children}
    </PreviewFileModalContext.Provider>
  )
};

const usePreviewFileModal = (): PreviewFileModalContextType => {
  return(useContext(PreviewFileModalContext))
};

export default usePreviewFileModal;
export {PreviewFileModalProvider};
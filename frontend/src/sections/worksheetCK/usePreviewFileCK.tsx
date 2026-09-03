import { ReactNode, createContext, useContext, useState } from 'react';

interface PreviewFileCKState {
  open: boolean;
  fileName: string;
  worksheetId: string;
  junctionId: number;
  kppnId: string;
}

interface PreviewFileCKContextType extends PreviewFileCKState {
  openPreview: (data: Omit<PreviewFileCKState, 'open'>) => void;
  closePreview: () => void;
}

const EMPTY_STATE: PreviewFileCKState = {
  open: false,
  fileName: '',
  worksheetId: '',
  junctionId: 0,
  kppnId: '',
};

const PreviewFileCKContext = createContext<PreviewFileCKContextType>({
  ...EMPTY_STATE,
  openPreview: () => {},
  closePreview: () => {},
});

function PreviewFileCKProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(EMPTY_STATE);
  const openPreview = (data: Omit<PreviewFileCKState, 'open'>) => setState({ ...data, open: true });
  const closePreview = () => setState(EMPTY_STATE);

  return (
    <PreviewFileCKContext.Provider value={{ ...state, openPreview, closePreview }}>
      {children}
    </PreviewFileCKContext.Provider>
  );
}

const usePreviewFileCK = () => useContext(PreviewFileCKContext);

// eslint-disable-next-line react-refresh/only-export-components
export default usePreviewFileCK;
export { PreviewFileCKProvider };

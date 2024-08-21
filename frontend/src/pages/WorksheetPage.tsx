import { Outlet } from 'react-router-dom';
import { PreviewFileModalProvider } from '../sections/worksheet/usePreviewFileModal';
//sections
import {WsJunctionProvider} from '../sections/worksheet/useWsJunction';
// -----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function WorksheetPage() {
  return (
    <>
      <WsJunctionProvider>
        <PreviewFileModalProvider>
          <Outlet />
        </PreviewFileModalProvider>
      </WsJunctionProvider>
    </>
  );
};

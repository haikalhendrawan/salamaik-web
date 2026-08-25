/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import { Outlet } from 'react-router-dom';
import { PreviewFileModalProvider } from '../sections/worksheetSPML/usePreviewFileModal';
//sections
import { WsSPMLJunctionProvider } from '../sections/worksheetSPML/useWsSPMLJunction';
// -----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function WorksheetSPMLPage() {
  return (
    <>
      <WsSPMLJunctionProvider>
        <PreviewFileModalProvider>
          <Outlet />
        </PreviewFileModalProvider>
      </WsSPMLJunctionProvider>
    </>
  );
}

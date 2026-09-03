import { Outlet } from 'react-router-dom';
import { WsCKJunctionProvider } from '../sections/worksheetCK/useWsCKJunction';
import { PreviewFileCKProvider } from '../sections/worksheetCK/usePreviewFileCK';

export default function WorksheetCKPage() {
  return (
    <WsCKJunctionProvider>
      <PreviewFileCKProvider>
        <Outlet />
      </PreviewFileCKProvider>
    </WsCKJunctionProvider>
  );
}

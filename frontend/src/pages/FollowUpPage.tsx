/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

//sections
import FollowUpKPPN from '../sections/followUp/FollowUpKPPN';
import { PreviewFileModalProvider } from '../sections/followUp/usePreviewFileModal';

// -----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function FollowUpPage() {

  return (
    <>
      <PreviewFileModalProvider>
        <FollowUpKPPN />
      </PreviewFileModalProvider>
    </>
  );
};

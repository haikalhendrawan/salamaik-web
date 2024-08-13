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

import { useAuth } from '../hooks/useAuth';
//sections
import StandardizationKanwil from '../sections/standardization/StandardizationKanwil';
import StandardizationKPPN from '../sections/standardization/StandardizationKPPN';
import { StandardizationProvider } from '../sections/standardization/useStandardization';
import { PreviewFileModalProvider } from '../sections/standardization/usePreviewFileModal';

// -----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function StandardizationPage() {
  const {auth} = useAuth();

  return (
    <>
      <StandardizationProvider>
        <PreviewFileModalProvider>
          {auth?.kppn==='03010'?<StandardizationKanwil/>:<StandardizationKPPN/>}
        </PreviewFileModalProvider>
      </StandardizationProvider>
    </>
  );
};

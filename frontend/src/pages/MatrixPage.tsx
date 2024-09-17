/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

//sections
import MatrixKPPN from '../sections/matrix/MatrixKPPN';
import { DialogProvider } from '../hooks/display/useDialog';

// -----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function MatrixPage() {

  return (
    <>
      <DialogProvider>
        <MatrixKPPN/>
      </DialogProvider>
    </>
  );
};

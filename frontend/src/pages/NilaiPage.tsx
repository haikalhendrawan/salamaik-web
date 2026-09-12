/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

//sections
import { DialogProvider } from '../hooks/display/useDialog';
import NilaiSection from '../sections/nilai';
// -----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function NilaiPage() {

  return (
    <>
      <DialogProvider>
        <NilaiSection />
      </DialogProvider>
    </>
  );
};

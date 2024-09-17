/**
 *Salamaik Client 
 * © Kanwil DJPb Sumbar 2024
 */

import UserRefSection from '../../sections/admin/userRef/UserRefSection';
import { UserProvider } from '../../sections/admin/userRef/useUser';
import { DialogProvider } from '../../hooks/display/useDialog';
// -----------------------------------------------------------------------

export default function UserRefPage () {

  return (
    <>
      <UserProvider>
        <DialogProvider>
          <UserRefSection />
        </DialogProvider>
      </UserProvider>
    </>

  );
};
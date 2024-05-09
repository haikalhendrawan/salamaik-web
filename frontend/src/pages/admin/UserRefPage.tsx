import {useState, useEffect} from'react';
import UserRefSection from '../../sections/admin/userRef/UserRefSection';
import { UserProvider } from '../../sections/admin/userRef/useUser';
import { DictionaryProvider } from '../../hooks/useDictionary';
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
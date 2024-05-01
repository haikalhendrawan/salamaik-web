import {useState, useEffect} from'react';
import UserRefSection from '../../sections/admin/userRef/UserRefSection';
import { UserProvider } from '../../sections/admin/userRef/useUser';
import { DictionaryProvider } from '../../hooks/useDictionary';
// -----------------------------------------------------------------------

export default function UserRefPage () {
  
  return (
    <>
      <UserProvider>
        <DictionaryProvider>
          <UserRefSection />
        </DictionaryProvider>
      </UserProvider>
    </>

  );
};
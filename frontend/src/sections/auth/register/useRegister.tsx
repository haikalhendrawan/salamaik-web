import { ReactNode, useState, createContext, useContext } from 'react';
//------------------------------------------------------------------
type registerContextType = {
};

type registerProviderProps = {
  children: ReactNode
};
//------------------------------------------------------------------
const RegisterContext = createContext<registerContextType>({});

const registerProvider = ({children}: registerProviderProps) => {
  const [isregister, setIsregister] = useState(false);

  return(
    <RegisterContext.Provider value={{isregister, setIsregister}}>
      {children}
    </RegisterContext.Provider>
  )
};

const useregister = (): registerContextType => {
  return(useContext(RegisterContext))
};

export default useregister;
export {registerProvider};
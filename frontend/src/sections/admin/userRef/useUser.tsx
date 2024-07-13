import { ReactNode, useState, createContext, useContext, useEffect } from 'react';
import useAxiosJWT from '../../../hooks/useAxiosJWT';
import useLoading from '../../../hooks/display/useLoading';
import useSnackbar from '../../../hooks/display/useSnackbar';
//------------------------------------------------------------------
interface UserType{
  id: string,
  username: string,
  name: string,
  email: string,
  picture: string,
  period: number,
  role: number,
  status: number,
  kppn: string,
  gender: number
};

interface UserContextType{
  user: UserType[] | [],
  getUser: () => Promise<void>
};

type UserProviderProps = {
  children: ReactNode
};
//------------------------------------------------------------------
const UserContext = createContext<UserContextType>({user: [], getUser: async() => {}});

const UserProvider = ({children}: UserProviderProps) => {
  const axiosJWT = useAxiosJWT();

  const { setIsLoading } = useLoading();

  const { openSnackbar } = useSnackbar();

  const [user, setUser] = useState<UserType[] | []  >([]);

  const getUser = async() => {
    try{
      setIsLoading(true);
      const response = await axiosJWT.get("/getUser");
      setUser(response.data.rows);
      setIsLoading(false);
    }catch(err: any){
      setIsLoading(false);
      openSnackbar(err.response.data.message, "error");
    }finally{
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   getUser();
  // }, [])

  return(
    <UserContext.Provider value={{user, getUser}}>
      {children}
    </UserContext.Provider>
  )
};

const useUser = (): UserContextType => {
  return(useContext(UserContext))
};

export default useUser;
export {UserProvider};
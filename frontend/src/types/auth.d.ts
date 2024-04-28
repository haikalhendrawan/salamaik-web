declare global{
  interface AuthType{
    auth:{
      id: string;
      username: string | number | null;
      name: string | null;
      email: string | null;
      picture: string | null;
      kppn: number;
      role: number;
      period: number;
      accessToken: string;
      status: number;
    },
    setAuth: (auth:AuthType | {[key: string]: any}) => void
  } 
}

export {}
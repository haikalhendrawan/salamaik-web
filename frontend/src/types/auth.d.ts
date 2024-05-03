declare global{
  interface AuthType{
    auth:{
      id: string;
      username: string | number | null;
      name: string | null;
      email: string | null;
      picture: string | null;
      kppn: string;
      role: number | null;
      period: number | null;
      accessToken: string | null;
      status: number | null;
    } | null,
    setAuth: (auth:AuthType | {[key: string]: any} | null) => void
  } 
}

export {}
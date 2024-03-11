declare global{
  interface AuthType{
    auth:{
      id: string | number, 
      username: string, 
      name: string, 
      email: string, 
      image: string, 
      role: string | number, 
      kppn: string | number, 
      accessToken: string, 
      namaPIC: string, 
      nipPIC: string, 
      emailPIC: string, 
      msg: string,
      errorMsg?:string
    },
    setAuth: (auth:AuthType | {[key: string]: any}) => void
  } 
}

export {}
export{}

type JwtPayloadType = {
  id: string;
  username: string;
  name: string;
  email: string;
  picture: string;
  kppn: string;
  role: number;
  period: number;
  status: number;
};

declare global {
  namespace Express {
    export interface Request {
      payload: JwtPayloadType
    }
  }
}
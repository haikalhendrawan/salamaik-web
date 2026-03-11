/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

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
  peraturan: number;
};

declare global {
  namespace Express {
    export interface Request {
      payload: JwtPayloadType
    }
  }
}
export{}

declare global {
  namespace Express {
    export interface Request {
      payload?: any
    }
  }
}
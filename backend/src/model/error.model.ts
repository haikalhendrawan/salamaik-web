export default class ErrorDetail extends Error{
    status: number;
    message: string;
    detail?: any;
    stack?: any;

  constructor(status: number, message: string, detail?: any, stack?:any){
    super(message);
    this.status = status;
    this.message = message;
    this.detail = detail;
    this.stack = stack;
  }
}


export const socketError = (callback: (res: {success: boolean, message: string | object}) => void, message: string) => {
  return callback({
    success: false,
    message: message
  })
}
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
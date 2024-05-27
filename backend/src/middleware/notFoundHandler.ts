import { Request, Response, NextFunction } from 'express';
import ErrorDetail from '../model/error.model';


export default function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  next(new ErrorDetail(404, 'Endpoint Not Found', 'Periksa kembali url yang anda input'));
}
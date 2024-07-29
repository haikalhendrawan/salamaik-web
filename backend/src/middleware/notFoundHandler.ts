import { Request, Response, NextFunction } from 'express';
import ErrorDetail from '../model/error.model';


// currently not used, not found handled by routes. See routes folder
export default function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  next(new ErrorDetail(404, 'Endpoint Not Found', 'Periksa kembali url yang anda input'));
}
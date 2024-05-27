import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

interface ErrorDetail extends Error {
  status?: number;
  message: string;
  detail?: any;
  stack?: any;
}

export default function errorHandler(err: ErrorDetail, req: Request, res: Response, next: NextFunction) {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || 'Internal Server Error';
  const errorDetail = err.detail || null;
  const errorStack = err.stack || null;

  logger.error(errorMessage);

  return res.status(errorStatus).json({
      success: false,
      message: errorMessage,
      detail: errorDetail,
      stack: errorStack
  });
} 
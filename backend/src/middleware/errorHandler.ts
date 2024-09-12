/**
 *Salamaik API 
 * © Kanwil DJPb Sumbar 2024
 */

import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import ErrorDetail from '../model/error.model';

interface ErrorDetailType extends Error {
  status?: number;
  message: string;
  detail?: any;
  stack?: any;
}

export default function errorHandler(err: ErrorDetailType, req: Request, res: Response, next: NextFunction) {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || 'Internal Server Error';
  const errorDetail = err.detail || null;
  const errorStack = err.stack || null;

  logger.error(errorMessage);

  if (err instanceof ErrorDetail) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      detail: err.detail || null,
      stack: err.stack || null
    });
  };

  return res.status(errorStatus).json({
      success: false,
      message: errorMessage,
      detail: errorDetail,
      stack: errorStack
  });
} 
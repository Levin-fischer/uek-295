import { Response, NextFunction } from 'express';
import { CorrelationIdRequest } from '../types/correlation-id-request';
import { randomInt } from '../lib/random.util.ts';

export function correlationIdMiddleware(
  req: CorrelationIdRequest,
  _res: Response,
  next: NextFunction,
) {
  req.correlationId = randomInt(10000, 99999);
  next();
}

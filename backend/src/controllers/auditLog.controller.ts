import { Request, Response } from 'express';
import { auditLogService } from '../services/auditLog.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';

export const auditLogController = {
  list: asyncHandler(async (request: Request, response: Response) => {
    const result = await auditLogService.list(request.query);
    return sendSuccess(response, result);
  }),
};

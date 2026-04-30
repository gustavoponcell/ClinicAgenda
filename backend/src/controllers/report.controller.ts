import { Request, Response } from 'express';
import { reportService } from '../services/report.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';

export const reportController = {
  dashboard: asyncHandler(async (_request: Request, response: Response) => {
    const result = await reportService.dashboard();
    return sendSuccess(response, result);
  }),

  appointments: asyncHandler(async (request: Request, response: Response) => {
    const result = await reportService.appointments(request.query);
    return sendSuccess(response, result);
  }),

  professionals: asyncHandler(async (request: Request, response: Response) => {
    const result = await reportService.professionals(request.query);
    return sendSuccess(response, result);
  }),
};

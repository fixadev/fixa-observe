import { Request, Response, NextFunction } from "express";

export const logFailedRequests = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const originalSend = res.send;
  res.send = function (body) {
    if (res.statusCode >= 400) {
      console.error("Failed request:", {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        requestBody: req.body,
        responseBody: body,
      });
    }
    return originalSend.call(this, body);
  };
  next();
};

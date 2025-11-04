import express from 'express';
import jwt from 'jsonwebtoken';
import type { AuthRequest, JwtPayload } from '../types/index.js';

export const authMiddleware = (
  req: AuthRequest,
  res: express.Response,
  next: express.NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

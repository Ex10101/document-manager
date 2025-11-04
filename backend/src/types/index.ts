import express from 'express';

export interface AuthRequest extends express.Request {
  userId?: number;
}

export interface JwtPayload {
  userId: number;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface DocumentCreateRequest {
  title: string;
  tag?: string;
}

export interface DocumentUpdateRequest {
  title?: string;
  tag?: string;
}

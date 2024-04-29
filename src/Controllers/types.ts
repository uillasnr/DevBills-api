import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthenticatedRequest<T> extends Request {
  user: { id: string, name: string, email: string } | JwtPayload;
}

export type BodyRequest<T> = AuthenticatedRequest<T>;
//export type QueryRequest<T> = Request<unknown, unknown, unknown, T> & { user: string | JwtPayload };
export type QueryRequest<T> = Request<unknown, unknown, unknown, T> & { user: { id: string } };

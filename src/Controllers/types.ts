import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

// Interface para o usuário decodificado a partir do token JWT
interface User {
  id: string;
  name: string;
  email: string;
}

// Tipo que pode ser um objeto User ou JwtPayload
export type UserOrJwtPayload = User | JwtPayload;

// Interface para a solicitação autenticada que inclui o usuário
export interface AuthenticatedRequest<T = any> extends Request {
  user?: UserOrJwtPayload;
  body: T;
}

// Tipo para solicitações que contêm um corpo (body)
export type BodyRequest<T> = AuthenticatedRequest<T>;

// Tipo para solicitações que contêm parâmetros de consulta (query)
export type QueryRequest<T> = Request<unknown, unknown, unknown, T> & { user?: UserOrJwtPayload };

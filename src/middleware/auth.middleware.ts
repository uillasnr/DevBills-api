
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "../Controllers/types";


export default function authMiddleware(
  req: AuthenticatedRequest<unknown>,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "" ) as JwtPayload;

    // Adiciona o usuário decodificado ao objeto de solicitação
    req.user = { id: decodedToken.userId };
    return next();
  } catch {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
  }
}

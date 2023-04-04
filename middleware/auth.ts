import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
const SECRET_KEY: string = process.env.JWT_SECRET!;

interface UserPayload extends JwtPayload {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface AuthenticatedRequest extends Request {
  user?: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

function auth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({
      message: 'No Authorization Header'
    });
  }
  try {
    const token = authorization.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({
        message: 'Invalid Token Format'
      });
    }
    const decode = jwt.verify(token, SECRET_KEY) as UserPayload;
    req.user = decode;

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({
        message: 'Session Expired',
        error: error.message
      });
    }
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({
        message: 'Invalid Token',
        error: error.message
      });
    }
    res.status(500).json({
      message: 'Internal server Error',
      error: error.message,
      stack: error.stack
    });
  }
}

export default auth;

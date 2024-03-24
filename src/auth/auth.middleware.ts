// auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization as string;

      if (!token) {
        throw new Error('Unauthorized');
      }

      const authResult = await this.authService.verifyAuth(token);

      if (authResult.success === true && authResult.results !== undefined) {
        req['logged'] = authResult.results;
        // console.log(authResult.results);
        next();
      } else {
        res.status(401).json({ message: authResult.message });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

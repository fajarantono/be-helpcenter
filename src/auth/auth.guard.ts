// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthMiddleware } from './auth.middleware';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authMiddleware: AuthMiddleware) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const token = request.headers.authorization;

    if (!token) {
      // No token provided, reject the request
      response.status(401).json({ message: 'No token provided' });
      return false;
    }

    return new Promise<boolean>((resolve) => {
      void this.authMiddleware.use(request, response, (err) => {
        if (err) {
          resolve(false); // If there's an error, resolve to false
        } else {
          resolve(true); // If authentication is successful, resolve to true
        }
      });
    });
  }
}

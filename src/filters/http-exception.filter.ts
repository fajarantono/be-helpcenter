import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    let errorMessage: string | { [key: string]: any } = 'Internal server error';

    if (typeof message === 'string') {
      errorMessage = message;
    } else if (typeof message === 'object' && message['message']) {
      errorMessage = message['message'];
    } else if (typeof message === 'object' && message['errors']) {
      errorMessage = message['errors'];
    }

    console.log(exception, 'exception');

    response.status(status).json({
      success: false,
      code: status,
      errors: errorMessage,
      message:
        typeof message === 'string'
          ? message
          : message['message'] || 'Internal server error',
    });
  }
}

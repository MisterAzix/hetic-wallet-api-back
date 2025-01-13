import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';


@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(500).json({
      message: 'Une erreur est survenue',
    });
  }
}
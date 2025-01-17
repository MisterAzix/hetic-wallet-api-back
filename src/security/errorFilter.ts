import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * ErrorFilter est un filtre d'exception personnalisé qui intercepte toutes les exceptions
 * et renvoie une réponse d'erreur standardisée.
 */
@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // Récupère l'objet de réponse à partir de l'host
    const response = host.switchToHttp().getResponse<Response>();
    // Envoie une réponse JSON avec un code de statut 500 et un message d'erreur normalisé
    response.status(500).json({
      message: 'Une erreur est survenue',
    });
  }
}

/**
 * Pour utiliser ce filtre d'exception, vous devez l'ajouter à un contrôleur.
 * Exemple d'utilisation dans un contrôleur :
 *
 * @UseFilters(new ErrorFilter())
 * @Controller('auth')
 * export class AuthController {
 *   // Vos méthodes de contrôleur ici
 * }
 *
 * Vous pouvez également l'ajouter globalement dans votre application principale :
 *
 * async function bootstrap() {
 *   const app = await NestFactory.create(AppModule);
 *   app.useGlobalFilters(new ErrorFilter());
 *   await app.listen(3000);
 * }
 * bootstrap();
 */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Vérifie si l'utilisateur a les rôles requis pour accéder à la route.
   * @param context - Le contexte d'exécution qui fournit l'accès à la requête et au handler.
   * @returns Un booléen indiquant si l'utilisateur peut accéder à la route.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

/**
 * Pour utiliser ce guard, vous devez définir les rôles requis sur vos routes à l'aide d'un décorateur personnalisé.
 * Exemple de décorateur :
 *
 * import { SetMetadata } from '@nestjs/common';
 *
 * export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
 *
 * Ensuite, appliquez le décorateur à vos routes :
 *
 * import { Controller, Get, UseGuards } from '@nestjs/common';
 * import { RolesGuard } from './rbac';
 * import { Roles } from './roles.decorator';
 *
 * @Controller('example')
 * @UseGuards(RolesGuard)
 * export class ExampleController {
 *   @Get()
 *   @Roles('admin')
 *   getAdminResource() {
 *     return 'This is an admin resource';
 *   }
 *
 *   @Get('user')
 *   @Roles('user')
 *   getUserResource() {
 *     return 'This is a user resource';
 *   }
 * }
 */

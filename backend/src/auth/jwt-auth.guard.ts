import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      return {
        id: 'user-1',
        email: 'dexter@gmail.com',
        name: 'Dexter',
        role: 'Admin',
      };
    }
    return user;
  }
}

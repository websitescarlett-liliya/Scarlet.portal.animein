import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard standar Passport-JWT. Strategy (jwt.strategy.ts) memvalidasi token
// dan menempelkan payload user (id, role) ke request.user.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

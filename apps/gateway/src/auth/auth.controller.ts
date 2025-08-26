import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@app/contracts/auth/user.entity';
import { map, first } from 'rxjs/operators';
import { JwtAuthGuard } from '@app/contracts/auth/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(@Inject() protected readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('users')
  findAll() {
    return this.authService.findAll().pipe(
      map((users: User[]) =>
        users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
        })),
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id).pipe(
      map((user: User | null) => {
        if (user) {
          return {
            id: user?.id,
            name: user?.name,
            email: user?.email,
          };
        }

        throw new NotFoundException({ message: 'User not found' });
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user/:id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.authService.deactivate(id);
  }

  // NOTE(suhail): disabled for the purposes of testing
  // @UseGuards(JwtAuthGuard)
  @Post('user')
  create(@Body() data: { name: string; email: string; password: string }) {
    return this.authService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user/:id')
  update(
    @Body() data: { id: string; name: string; email: string; password: string },
  ) {
    return this.authService.update(data);
  }

  @Post('login')
  login(@Body() input: { email: string; password: string }) {
    const result = this.authService.login(input).pipe(
      first((user) => {
        if (!user) {
          throw new UnauthorizedException();
        }
        return true;
      }),
    );
    return result;
  }
}

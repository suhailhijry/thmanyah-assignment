import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@app/contracts/auth/user.entity';
import { map } from 'rxjs/operators';

@Controller('auth')
export class AuthController {
  constructor(@Inject() protected readonly authService: AuthService) {}

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

  @Patch('user/:id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.authService.deactivate(id);
  }

  @Post('user')
  create(@Body() data: { name: string; email: string; password: string }) {
    return this.authService.create(data);
  }

  @Patch('user/:id')
  update(
    @Body() data: { id: string; name: string; email: string; password: string },
  ) {
    return this.authService.update(data);
  }

  @Post('login')
  login(@Body() input: { email: string; password: string }) {
    return this.authService.login(input);
  }
}

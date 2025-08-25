import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';
import { AuthPatterns } from '@app/contracts/auth/auth.patterns';
import { UsersService } from './users/users.service';
import { User } from '@app/contracts/auth/user.entity';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @MessagePattern(AuthPatterns.LOGIN)
  async login(input: { email: string; password: string }): Promise<{
    accessToken: string;
    refreshToken: string;
    userId: string;
  } | null> {
    return await this.authService.authenticate(input);
  }

  @MessagePattern(AuthPatterns.NEW_USER)
  create(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    return this.usersService.create(data.name, data.email, data.password);
  }

  @MessagePattern(AuthPatterns.ALL_USERS)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @MessagePattern(AuthPatterns.FIND_USER)
  findOne(id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }

  @MessagePattern(AuthPatterns.DEACTIVATE_USER)
  deactivate(id: string): Promise<void> {
    return this.usersService.deactivate(id);
  }

  @MessagePattern(AuthPatterns.UPDATE_USER)
  update(data: {
    id: string;
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    return this.usersService.update(
      data.id,
      data.name,
      data.email,
      data.password,
    );
  }
}

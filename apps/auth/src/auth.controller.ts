import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.login')
  async login(input: { email: string, password: string }): Promise<{ accessToken: string; refreshToken: string; userId: string } | null> {
    return await this.authService.authenticate(input);
  }
}

import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

type AuthInput = { email: string; password: string };
type LoginData = { userId: string; email: string };
type AuthResult = { accessToken: string; refreshToken: string; userId: string };

@Injectable()
export class AuthService {
  constructor(protected readonly usersService: UsersService, protected readonly jwtService: JwtService) {}

  async authenticate(input: AuthInput): Promise<AuthResult | null> {
    const user = await this.validate(input);
    if (!user) {
      return null;
    }
    return this.login(user);
  }

  async login(data: LoginData): Promise<AuthResult> {
    const payload = { sub: data.userId, email: data.email };
    const token = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' });

    return { accessToken: token, refreshToken: refreshToken, userId: data.userId };
  }

  async validate(input: AuthInput): Promise<LoginData | null> {
    const user = await this.usersService.findByEmail(input.email);

    if (user && await bcrypt.compare(input.password, user.password)) {
      return {
        userId: user.id,
        email: user.email,
      };
    }

    return null;
  }
}

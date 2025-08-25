import { AuthPatterns } from '@app/contracts/auth/auth.patterns';
import { AUTH_CLIENT } from '@app/contracts/auth/constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_CLIENT) private readonly usersClient: ClientProxy) {}

  findAll() {
    return this.usersClient.send(AuthPatterns.ALL_USERS, {});
  }

  findOne(id: string) {
    return this.usersClient.send(AuthPatterns.FIND_USER, id);
  }

  login(input: { email: string; password: string }) {
    return this.usersClient.send(AuthPatterns.LOGIN, input);
  }

  create(data: { name: string; email: string; password: string }) {
    return this.usersClient.send(AuthPatterns.NEW_USER, data);
  }

  deactivate(id: string) {
    return this.usersClient.send(AuthPatterns.DEACTIVATE_USER, id);
  }

  update(data: { id: string; email: string; password: string }) {
    return this.usersClient.send(AuthPatterns.UPDATE_USER, data);
  }
}

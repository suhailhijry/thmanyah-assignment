import { Controller, Inject } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern } from '@nestjs/microservices';
import { User } from '@app/contracts/auth/user.entity';

@Controller('users')
export class UsersController {
  constructor(@Inject() protected readonly usersService: UsersService) {}

  @MessagePattern('users.create')
  create(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    return this.usersService.create(data.email, data.password);
  }

  @MessagePattern('users.findAll')
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @MessagePattern('users.findOne')
  findOne(id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }

  @MessagePattern('users.deactivate')
  deactivate(id: string): Promise<void> {
    return this.usersService.deactivate(id);
  }

  @MessagePattern('users.update')
  update(data: { id: string; email: string; password: string }): Promise<User> {
    return this.usersService.update(data.id, data.email, data.password);
  }
}

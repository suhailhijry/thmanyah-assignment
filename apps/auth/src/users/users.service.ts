import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findOne(id: string): Promise<User | null> {
        return this.userRepository.findOneBy({ id });
    }

    async deactivate(id: string): Promise<void> {
        await this.userRepository.update(id, { isActive: false });
    }

    async create(email: string, password: string): Promise<User> {
        const newUser = this.userRepository.create({ email, password });
        return this.userRepository.save(newUser);
    }

    async update(id: string, email: string, password: string): Promise<User> {
        await this.userRepository.update(id, { email, password });
        const result = await this.findOne(id);
        return result!;
    }

    async authenticate(email: string, password: string): Promise<User | null> {
        const user = await this.userRepository.findOneBy({ email, isActive: true });
        // TODO: authenticate using passport

        return user || null;
    }
}

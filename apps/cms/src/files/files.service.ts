import { File } from '@app/contracts/cms/file.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
  ) {}

  findAll(): Promise<File[]> {
    return this.fileRepository.find();
  }

  findOne(id: string): Promise<File | null> {
    return this.fileRepository.findOneBy({ id });
  }

  async delete(id: string): Promise<void> {
    await this.fileRepository.delete(id);
  }

  async setName(id: string, name: string): Promise<File> {
    await this.fileRepository.update(id, { name });
    const result = await this.findOne(id);
    return result!;
  }

  async create(name: string, path: string, user: string): Promise<File> {
    const newFile = this.fileRepository.create({
      name,
      path,
      userId: user,
    });
    return this.fileRepository.save(newFile);
  }
}

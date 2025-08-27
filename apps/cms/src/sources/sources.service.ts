import {
  Source,
  SourceOrigin,
  SourceType,
} from '@app/contracts/cms/source.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SourcesService {
  constructor(
    @InjectRepository(Source) private sourcesRepository: Repository<Source>,
  ) {}

  findAll(): Promise<Source[]> {
    return this.sourcesRepository.find();
  }

  findOne(id: string): Promise<Source | null> {
    return this.sourcesRepository.findOneBy({ id });
  }

  async delete(id: string): Promise<void> {
    await this.sourcesRepository.delete(id);
  }

  async setName(id: string, name: string): Promise<Source> {
    await this.sourcesRepository.update(id, { name });
    const result = await this.findOne(id);
    return result!;
  }

  async create(
    type: SourceType,
    origin: SourceOrigin | null,
    name: string,
    path: string,
    user: string,
  ): Promise<Source> {
    return await this.sourcesRepository.save({
      type: type,
      origin: origin ?? undefined,
      name: name,
      path: path,
      userId: user,
    });
  }
}

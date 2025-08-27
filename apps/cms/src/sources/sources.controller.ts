import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CMSPatterns } from '@app/contracts/cms/cms.patterns';
import { SourcesService } from './sources.service';
import {
  Source,
  SourceOrigin,
  SourceType,
} from '@app/contracts/cms/source.entity';
import path from 'path';
import { randomBytes } from 'crypto';
import * as fs from 'fs';
import { writeFile } from 'fs/promises';

type UploadPayload = {
  file: Buffer;
  filename: string;
  mimetype: string;
  userId: string;
};

@Controller('sources')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @MessagePattern(CMSPatterns.SOURCE_UPLOAD)
  async upload(
    @Payload() payload: UploadPayload,
  ): Promise<Source | { message: string }> {
    try {
      // NOTE(suhail): can use an s3 bucket here instead
      const uploadPath = path.join(__dirname, '../../', 'files');
      const filePath = path.join(
        uploadPath,
        randomBytes(64).toString('base64url'),
      );

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }

      const buffer = Buffer.from(payload.file);
      await writeFile(filePath, buffer);
      return this.sourcesService.create(
        SourceType.LOCAL,
        null,
        payload.filename,
        filePath,
        payload.userId,
      );
    } catch (e) {
      return {
        message: `${e}`,
      };
    }
  }

  @MessagePattern(CMSPatterns.SOURCE_FROM_URL)
  async fromUrl(data: {
    name: string;
    origin: SourceOrigin;
    url: string;
    userId: string;
  }): Promise<Source | { message: string }> {
    return await this.sourcesService.create(
      SourceType.URL,
      data.origin,
      data.name,
      data.url,
      data.userId,
    );
  }

  @MessagePattern(CMSPatterns.SOURCE_FIND)
  async find(id: string): Promise<Source | null> {
    return await this.sourcesService.findOne(id);
  }

  @MessagePattern(CMSPatterns.SOURCE_DELETE)
  async delete(id: string): Promise<void> {
    await this.sourcesService.delete(id);
  }

  @MessagePattern(CMSPatterns.SOURCE_UPDATE_NAME)
  async setName(id: string, name: string): Promise<Source> {
    return await this.sourcesService.setName(id, name);
  }
}

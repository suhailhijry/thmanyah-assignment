import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CMSPatterns } from '@app/contracts/cms/cms.patterns';
import { FilesService } from './files.service';
import { File } from '@app/contracts/cms/file.entity';
import path from 'path';
import { randomBytes } from 'crypto';
import * as fs from 'fs';
import { writeFile } from 'fs/promises';

type FilePayload = {
  file: Buffer;
  filename: string;
  mimetype: string;
  userId: string;
};

@Controller('files')
export class FilesController {
  constructor(private readonly fileService: FilesService) {}

  @MessagePattern(CMSPatterns.FILE_UPLOAD)
  async upload(
    @Payload() payload: FilePayload,
  ): Promise<File | { message: string }> {
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
      return this.fileService.create(
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

  @MessagePattern(CMSPatterns.FILE_FIND)
  async find(id: string): Promise<File | { message: string }> {
    return (
      (await this.fileService.findOne(id)) ?? { message: 'File not found.' }
    );
  }

  @MessagePattern(CMSPatterns.FILE_DELETE)
  async delete(id: string): Promise<void> {
    await this.fileService.delete(id);
  }

  @MessagePattern(CMSPatterns.FILE_UPDATE_NAME)
  async setName(id: string, name: string): Promise<File> {
    return await this.fileService.setName(id, name);
  }
}

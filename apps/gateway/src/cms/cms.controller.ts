import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CmsService } from './cms.service';
import type { FastifyRequest } from 'fastify';
import { JwtAuthGuard } from '@app/contracts/auth/jwt.guard';
import { map, firstValueFrom } from 'rxjs';
import { File } from '@app/contracts/cms/file.entity';
import { createReadStream } from 'fs';

@UseGuards(JwtAuthGuard)
@Controller('cms')
export class CmsController {
  constructor(@Inject() protected readonly cmsService: CmsService) {}

  @Get('file/:id')
  findFile(@Param('id') id: string) {
    return this.cmsService.findFile(id).pipe(
      map((file: File | null) => ({
        id: file?.id,
        name: file?.name,
        user: file?.user?.id,
      })),
    );
  }

  @Get('file/:id/stream')
  async download(@Param('id') id: string) {
    // NOTE(suhail): can use s3 streaming instead (if applicable)
    const path = (
      await firstValueFrom<File | null>(this.cmsService.findFile(id))
    )?.path;
    if (!path) {
      throw new NotFoundException({
        message: 'File not found',
      });
    }
    return createReadStream(path);
  }

  @Post('file/upload')
  async uploadFile(@Req() req: FastifyRequest) {
    const file = (await req.file())!;
    const buffer = await file.toBuffer();

    return this.cmsService
      .uploadFile({
        file: buffer,
        filename: file.filename,
        mimetype: file.mimetype,
        userId: (req as any).user.id,
      })
      .pipe(
        map((file: File) => ({
          id: file.id,
          name: file.name,
          user: file.user.id,
        })),
      );
  }
}

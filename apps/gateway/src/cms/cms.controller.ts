import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CmsService } from './cms.service';
import type { FastifyRequest } from 'fastify';
import { JwtAuthGuard } from '@app/contracts/auth/jwt.guard';
import { map, firstValueFrom } from 'rxjs';
import { File } from '@app/contracts/cms/file.entity';
import { createReadStream } from 'fs';
import { MediaType } from '@app/contracts/cms/media.entity';
import { MediaMappingInterceptor } from '@app/contracts/cms/media.interceptor';

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
        user: file?.userId,
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

  @Post('file')
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
          user: file.userId,
        })),
      );
  }

  @Post('media')
  @UseInterceptors(MediaMappingInterceptor)
  createMedia(
    @Body()
    data: {
      type: MediaType;
      title: string;
      description: string;
      source: string;
      thumbnail: string;
      keywords: string[] | null | undefined;
      metadata: {
        duration: number | null;
        width: number | null;
        height: number | null;
        codec: string | null;
        bitrate: number | null;
      };
    },
    @Req() req: FastifyRequest,
  ) {
    console.log('request metadata is:', data.metadata);
    return this.cmsService.createMedia({
      type: data.type,
      title: data.title,
      description: data.description,
      source: data.source,
      thumbnail: data.thumbnail,
      keywords: data.keywords,
      metadata: data.metadata,
      user: (req as any).user.id,
    });
  }

  @Get('media')
  @UseInterceptors(MediaMappingInterceptor)
  getAllMedia() {
    return this.cmsService.getAll();
  }

  @Get('media/:id')
  @UseInterceptors(MediaMappingInterceptor)
  getMedia(@Param('id') id: string) {
    return this.cmsService.getMedia(id);
  }

  @Get('media/:id/metadata')
  getMediaMetadata(@Param('id') id: string) {
    return this.cmsService.getMetadata(id);
  }

  @Post('media/:id/metadata')
  setMetadata(
    @Param('id') id: string,
    @Body()
    data: {
      duration: number | null;
      width: number | null;
      height: number | null;
      codec: string | null;
      bitrate: number | null;
      language: string | null;
      category: string | null;
    },
    @Req() req: FastifyRequest,
  ) {
    return this.cmsService.setMetadata(id, data, (req as any).user.id);
  }
}

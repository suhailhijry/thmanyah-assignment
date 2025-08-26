import { CMSPatterns } from '@app/contracts/cms/cms.patterns';
import { Media, MediaType } from '@app/contracts/cms/media.entity';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MediaService } from './media.service';

type MediaInput = {
  type: MediaType | null;
  title: string | null;
  description: string | null;
  source: string | null;
  thumbnail: string | null;
  user: string | null;
  keywords: string[] | null;
};

type MetadataInput = {
  duration: number | null;
  width: number | null;
  height: number | null;
  codec: string | null;
  bitrate: number | null;
};

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern(CMSPatterns.MEDIA_NEW)
  async create(
    media: MediaInput,
    metadata: null | MetadataInput,
  ): Promise<Media> {
    return await this.mediaService.create(
      media.type!,
      media.title!,
      media.description!,
      media.source!,
      media.thumbnail!,
      media.user!,
      metadata,
      media.keywords ?? [],
    );
  }

  @MessagePattern(CMSPatterns.MEDIA_FIND)
  async find(id: string) {
    return this.mediaService.findOne(id);
  }

  @MessagePattern(CMSPatterns.MEDIA_ALL)
  async all() {
    return this.mediaService.findAll();
  }

  @MessagePattern(CMSPatterns.MEDIA_UPDATE)
  async update(id: string, data: MediaInput) {
    return this.mediaService.update(id, { ...data });
  }
}

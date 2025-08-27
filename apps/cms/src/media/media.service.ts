import { Media, MediaType } from '@app/contracts/cms/media.entity';
import { MediaMetadata } from '@app/contracts/cms/media_metadata.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
    @InjectRepository(MediaMetadata)
    private metadataRepository: Repository<MediaMetadata>,
  ) {}

  async findAll(): Promise<Media[]> {
    return await this.mediaRepository.find({
      order: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: string): Promise<Media | null> {
    return this.mediaRepository.findOneBy({ id });
  }

  async discard(id: string): Promise<void> {
    await this.mediaRepository.delete(id);
  }

  async create(
    type: MediaType,
    title: string,
    description: string,
    source: string,
    thumbnail: string,
    user: string,
    metadata: null | {
      duration: number | null;
      width: number | null;
      height: number | null;
      codec: string | null;
      bitrate: number | null;
    },
    keywords: null | string[],
  ): Promise<Media> {
    if (metadata) {
      const result = await this.mediaRepository.save({
        type: type,
        title: title,
        description: description,
        sourceId: source,
        thumbnailId: thumbnail,
        userId: user,
        isPublished: false,
        keywords: keywords || [],
      });

      await this.metadataRepository.insert({
        ...metadata,
        mediaId: result.id,
        userId: user,
      } as DeepPartial<MediaMetadata>);

      console.log('media creation result:', result);
      return result;
    } else {
      const result = this.mediaRepository.save({
        type: type,
        title: title,
        description: description,
        sourceId: source,
        thumbnailId: thumbnail,
        userId: user,
        isPublished: false,
        keywords: keywords || [],
      });
      return result;
    }
  }

  async publish(id: string): Promise<Media> {
    await this.mediaRepository.update(id, {
      isPublished: true,
      publishedAt: new Date(),
    });
    const result = await this.findOne(id);
    return result!;
  }

  async update(
    id: string,
    data: {
      title: string | null;
      description: string | null;
      source: string | null;
      thumbnail: string | null;
      keywords: string[] | null;
    },
  ): Promise<Media | null> {
    const m = await this.mediaRepository.exists({ where: { id } });
    if (!m) {
      return null;
    }

    return await this.mediaRepository.save({
      id: id,
      title: data.title ?? undefined,
      description: data.description ?? undefined,
      keywords: data.keywords ?? undefined,
    });
  }

  async getMetadata(media: string) {
    return await this.metadataRepository.findOneBy({ mediaId: media });
  }

  async setMetadata(
    media: string,
    duration: number | null,
    width: number | null,
    height: number | null,
    codec: string | null,
    bitrate: number | null,
  ): Promise<Media> {
    const m = await this.metadataRepository.findOneBy({ mediaId: media });

    if (!m) {
      await this.metadataRepository.save({
        duration: duration,
        width: width,
        height: height,
        codec: codec,
        bitrate: bitrate,
        mediaId: media,
      } as DeepPartial<MediaMetadata>);
      const result = await this.mediaRepository.findOneBy({
        id: media,
      });
      return result!;
    } else {
      const result = await this.mediaRepository.findOneBy({
        id: media,
      });
      await this.metadataRepository.save({
        id: m.id,
        duration,
        width,
        height,
        codec,
        bitrate,
      } as DeepPartial<MediaMetadata>);
      return result!;
    }
  }
}

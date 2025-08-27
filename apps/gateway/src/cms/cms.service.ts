import { CMSPatterns } from '@app/contracts/cms/cms.patterns';
import { CMS_CLIENT } from '@app/contracts/cms/constants';
import { Source } from '@app/contracts/cms/source.entity';
import { MediaType } from '@app/contracts/cms/media.entity';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SourceOrigin } from 'module';

@Injectable()
export class CmsService {
  constructor(@Inject(CMS_CLIENT) private readonly cmsClient: ClientProxy) {}

  uploadFile(payload: {
    file: Buffer;
    filename: string;
    mimetype: string;
    userId: string;
  }) {
    return this.cmsClient.send(CMSPatterns.SOURCE_UPLOAD, payload);
  }

  sourceFromUrl(payload: {
    name: string;
    url: string;
    origin: SourceOrigin;
    userId: string;
  }) {
    return this.cmsClient.send(CMSPatterns.SOURCE_FROM_URL, payload);
  }

  findSource(id: string) {
    return this.cmsClient.send<Source | null>(CMSPatterns.SOURCE_FIND, id);
  }

  deleteSource(id: string) {
    return this.cmsClient.send(CMSPatterns.SOURCE_DELETE, id);
  }

  setSourceNAme(id: string, name: string) {
    return this.cmsClient.send(CMSPatterns.SOURCE_UPDATE_NAME, { id, name });
  }

  createMedia(data: {
    type: MediaType;
    title: string;
    description: string;
    source: string;
    thumbnail: string;
    user: string;
    keywords: string[] | null | undefined;
    metadata: {
      duration: number | null;
      width: number | null;
      height: number | null;
      codec: string | null;
      bitrate: number | null;
    };
  }) {
    console.log('cms service metadata: ', data.metadata);
    return this.cmsClient.send(CMSPatterns.MEDIA_NEW, data);
  }

  getMedia(id: string) {
    return this.cmsClient.send(CMSPatterns.MEDIA_FIND, id);
  }

  getAll() {
    return this.cmsClient.send(CMSPatterns.MEDIA_ALL, {});
  }

  getMetadata(id: string) {
    return this.cmsClient.send(CMSPatterns.MEDIA_METADATA, id);
  }

  setMetadata(
    id: string,
    data: {
      duration: number | null;
      width: number | null;
      height: number | null;
      codec: string | null;
      bitrate: number | null;
      language: string | null;
      category: string | null;
    },
    userId: string,
  ) {
    return this.cmsClient.send(CMSPatterns.MEDIA_METADATA_UPDATE, {
      id: id,
      data: data,
      userId: userId,
    });
  }
}

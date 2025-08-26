import { CMSPatterns } from '@app/contracts/cms/cms.patterns';
import { CMS_CLIENT } from '@app/contracts/cms/constants';
import { File } from '@app/contracts/cms/file.entity';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CmsService {
  constructor(@Inject(CMS_CLIENT) private readonly cmsClient: ClientProxy) {}

  uploadFile(payload: {
    file: Buffer;
    filename: string;
    mimetype: string;
    userId: string;
  }) {
    return this.cmsClient.send(CMSPatterns.FILE_UPLOAD, payload);
  }

  findFile(id: string) {
    return this.cmsClient.send<File | null>(CMSPatterns.FILE_FIND, id);
  }

  deleteFile(id: string) {
    return this.cmsClient.send(CMSPatterns.FILE_DELETE, id);
  }

  setFileName(id: string, name: string) {
    return this.cmsClient.send(CMSPatterns.FILE_UPDATE_NAME, { id, name });
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class CmsService {
  health(): { message: string } {
    return { message: 'Running!' };
  }
}

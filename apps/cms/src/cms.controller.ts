import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CMSPatterns } from '@app/contracts/cms/cms.patterns';
import { CmsService } from './cms.service';
@Controller()
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @MessagePattern(CMSPatterns.HEALTH)
  health() {
    return this.cmsService.health();
  }
}

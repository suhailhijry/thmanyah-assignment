import { CMS_CLIENT } from '@app/contracts/cms/constants';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: CMS_CLIENT,
        transport: Transport.TCP,
        options: {
          host: process.env.CMS_SERVICE_HOST || '0.0.0.0',
          port: parseInt(process.env.CMS_SERVICE_PORT || '3002'),
        },
      },
    ]),
  ],
  controllers: [CmsController],
  providers: [CmsService],
})
export class CmsModule {}

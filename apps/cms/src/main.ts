import { NestFactory } from '@nestjs/core';
import { CmsModule } from './cms.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(CmsModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.CMS_SERVICE_HOST || '0.0.0.0',
      port: parseInt(process.env.CMS_SERVICE_PORT || '3002'),
    },
  });
  await app.listen();
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});

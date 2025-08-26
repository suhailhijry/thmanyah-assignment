import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    GatewayModule,
    new FastifyAdapter({ logger: true }),
  );
  await app.register(multipart as any, {
    limits: {
      // 10GB max (may be in a config)
      fileSize: 1024 * 1024 * 1024 * 10,
      fieldNameSize: 256,
      // MAX number of files to upload
      files: 1,
    },
    attachFieldsToBody: false,
  });
  await app.listen(process.env.GATEWAY_PORT ?? 3000, '0.0.0.0');
}
void bootstrap();

import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    GatewayModule,
    new FastifyAdapter({ logger: true }),
  );
  await app.listen(process.env.GATEWAY_PORT ?? 3000, '0.0.0.0');
}
void bootstrap();

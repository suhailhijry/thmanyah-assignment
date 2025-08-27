import { NestFactory } from '@nestjs/core';
import { DiscoveryModule } from './discovery.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(DiscoveryModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.DISCOVERY_SERVICE_HOST || '0.0.0.0',
      port: parseInt(process.env.DISCOVERY_SERVICE_PORT || '3003'),
    },
  });
  await app.listen();
}
bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});

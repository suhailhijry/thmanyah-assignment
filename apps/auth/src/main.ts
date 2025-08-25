import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AuthModule,
    {
      useFactory: (configService: ConfigService) => ({
        transport: Transport.TCP,
        options: {
          host: configService.get<string>('AUTH_SERVICE_HOST'),
          port: configService.get<number>('AUTH_SERVICE_PORT'),
        },
      }),
    }
  );
  await app.listen();
}
bootstrap();

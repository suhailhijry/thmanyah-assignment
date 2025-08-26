import { Module } from '@nestjs/common';
import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';
import { FilesModule } from './files/files.module';
import { MediaModule } from './media/media.module';
import { ConfigModule } from '@nestjs/config';
import { File } from '@app/contracts/cms/file.entity';
import { Media } from '@app/contracts/cms/media.entity';
import { MediaMetadata } from '@app/contracts/cms/media_metadata.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/contracts/auth/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST ?? 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? 'root',
      database: process.env.DB_NAME ?? 'thmanyah_assignment',
      entities: [User, File, Media, MediaMetadata],
    }),
    FilesModule,
    MediaModule,
  ],
  controllers: [CmsController],
  providers: [CmsService],
})
export class CmsModule {}

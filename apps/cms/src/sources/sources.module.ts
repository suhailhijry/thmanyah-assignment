import { Source } from '@app/contracts/cms/source.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourcesService } from './sources.service';
import { SourcesController } from './sources.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Source])],
  providers: [SourcesService],
  exports: [SourcesService],
  controllers: [SourcesController],
})
export class SourcesModule {}

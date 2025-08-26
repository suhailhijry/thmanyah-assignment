import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { File } from './file.entity';
import { MediaMetadata } from './media_metadata.entity';

export enum MediaType {
  VIDEO = 'video',
  AUDIO = 'audio',
}

@Entity({ name: 'media' })
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: MediaType })
  type: MediaType;

  @OneToOne(() => File, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sourceId' })
  source: File;

  @OneToOne(() => File, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'thumbnailId' })
  thumbnail: File;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json', nullable: true, default: [] })
  keywords: string[];

  @Column()
  isPublished: boolean;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => MediaMetadata, (metadata) => metadata.media, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  metadata: MediaMetadata;
}

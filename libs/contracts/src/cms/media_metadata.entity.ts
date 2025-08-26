import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Media } from './media.entity';

@Entity({ name: 'media_metadata' })
export class MediaMetadata {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @Column({ type: 'int', nullable: true })
  width: number;

  @Column({ type: 'int', nullable: true })
  height: number;

  @Column({ nullable: true })
  codec: string;

  @Column({ type: 'int', nullable: true })
  bitrate: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToOne(() => Media, (media) => media.metadata)
  media: Media;
}

import { Entity, Column, PrimaryGeneratedColumn, ForeignKey } from 'typeorm';

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

  @Column({ nullable: true })
  language: string;

  @Column({ nullable: true })
  category: string;

  @Column()
  @ForeignKey('users')
  userId: string;

  @Column()
  @ForeignKey('media')
  mediaId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

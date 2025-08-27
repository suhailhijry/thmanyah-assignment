import { Entity, Column, PrimaryGeneratedColumn, ForeignKey } from 'typeorm';

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

  @Column()
  @ForeignKey('sources')
  sourceId: string;

  @Column()
  @ForeignKey('sources')
  thumbnailId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'json', nullable: true, default: [] })
  keywords: string[];

  @Column()
  @ForeignKey('users')
  userId: string;

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
}

import { Entity, Column, PrimaryGeneratedColumn, ForeignKey } from 'typeorm';

export enum SourceType {
  LOCAL = 'local',
  URL = 'url',
}

export enum SourceOrigin {
  YOUTUBE = 'youtube',
}

@Entity({ name: 'sources' })
export class Source {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  path: string;

  @Column({ type: 'enum', enum: SourceType })
  type: SourceType;

  @Column({ type: 'enum', enum: SourceOrigin, nullable: true })
  origin: SourceOrigin;

  @Column()
  @ForeignKey('users')
  userId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}

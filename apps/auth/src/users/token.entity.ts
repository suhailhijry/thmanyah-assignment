import { Entity, Column, PrimaryGeneratedColumn, ForeignKey, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Token {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("uuid", { name: 'user_id' })
    @ForeignKey<User>("User", "uuid", { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    userId: string;

    @Column()
    value: string;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => User, user => user.tokens)
    user: User;
}

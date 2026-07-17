import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity()
@Unique(['name', 'userId'])
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true})
  appId: string;

  @Column('text')
  privateKey: string;

  @Column('text')
  publicKey: string;

  @Column('simple-array', { nullable: true })
  allowedOrigins: string[];

  @Column({ nullable: true })
  googleClientId: string;

  @Column({ nullable: true })
  googleClientSecret: string;

  @Column()
  userId: string; // The developer who owns this app

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
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

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}

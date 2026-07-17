import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  Unique,
} from 'typeorm';
import { Role } from './role.entity';
import { UserStatus } from 'src/common/enum/user-status.enum';

@Entity()
@Unique(['email', 'appId'])
@Unique(['userName', 'appId'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  appId: string;

  @Column()
  userName: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  picture?: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @CreateDateColumn()
  createDate: Date;
}

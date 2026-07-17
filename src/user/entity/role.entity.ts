import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Unique,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Application } from '../../application/entity/application.entity';

@Entity()
@Unique(['name', 'appId'])
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  appId: string;

  @ManyToOne(() => Application, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'appId', referencedColumnName: 'appId' })
  application: Application;

  @Column()
  name: string;

  @CreateDateColumn()
  createDate: Date;
}

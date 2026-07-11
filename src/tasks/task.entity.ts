import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { TaskStatus } from './task.model';
import { User } from '../users/user.entity';
import { TaskLabel } from './task-label.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  title!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description!: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.OPEN,
  })
  status!: TaskStatus;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.tasks, { nullable: false })
  user: User;

  @OneToMany(() => TaskLabel, (taskLabel) => taskLabel.task)
  labels: TaskLabel[];
}

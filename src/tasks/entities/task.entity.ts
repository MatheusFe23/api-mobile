import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import {
  IsNotEmpty,
  IsDateString,
  MaxLength,
  IsBoolean,
  IsOptional,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/entities/user.entity";

@Entity("tasks")
export class Task {
  @ApiProperty({ description: "Task unique identifier", example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "The title of the task",
    example: "Buy groceries",
  })
  @Column()
  @IsNotEmpty({ message: "Title is required" })
  @MaxLength(100, { message: "Title cannot exceed 100 characters" })
  title: string;

  @ApiProperty({
    description: "Detailed description of the task",
    example: "Milk, Eggs, Bread and Butter",
  })
  @Column("text")
  @IsNotEmpty({ message: "Description is required" })
  description: string;

  @ApiProperty({
    description: "Whether the task is completed or not",
    example: false,
  })
  @Column({ default: false })
  @IsBoolean()
  @IsOptional()
  isCompleted: boolean;

  @ApiProperty({
    description: "The deadline for this task",
    example: "2026-12-31T23:59:59.000Z",
  })
  @Column()
  @IsNotEmpty({ message: "Due date is required" })
  @IsDateString({}, { message: "Must be a valid ISO date string" })
  dueDate: Date;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: number;
}

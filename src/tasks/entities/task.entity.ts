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
  IsEnum,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { User } from "../../users/entities/user.entity";
import { TaskCategory } from "../enums/task-category.enum";

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
  @MaxLength(255, { message: "Title cannot exceed 255 characters" })
  title: string;

  @ApiPropertyOptional({
    description: "Detailed description of the task",
    example: "Milk, Eggs, Bread and Butter",
  })
  @Column("text", { default: "" })
  @IsOptional()
  description: string;

  @ApiProperty({
    description: "Whether the task is completed or not",
    example: false,
  })
  @Column({ default: false })
  @IsBoolean()
  @IsOptional()
  isCompleted: boolean;

  @ApiPropertyOptional({
    description: "The deadline for this task",
    example: "2026-12-31T23:59:59.000Z",
  })
  @Column({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: "Must be a valid ISO date string" })
  dueDate?: Date;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @ApiProperty({
    description: "The category of the task",
    enum: TaskCategory,
    example: TaskCategory.OUTROS,
  })
  @Column({
    type: "varchar",
    default: TaskCategory.OUTROS,
  })
  @IsEnum(TaskCategory, { message: "Invalid category" })
  @IsOptional()
  category: TaskCategory;

  @Column()
  userId: number;
}

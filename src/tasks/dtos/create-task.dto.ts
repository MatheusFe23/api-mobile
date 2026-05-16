import {
  IsNotEmpty,
  IsDateString,
  MaxLength,
  IsOptional,
  IsEnum,
  IsBoolean,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TaskCategory } from "../enums/task-category.enum";

export class CreateTaskDto {
  @ApiProperty({
    description: "The title of the task",
    example: "Buy groceries",
  })
  @IsNotEmpty({ message: "Title is required" })
  @MaxLength(100, { message: "Title cannot exceed 100 characters" })
  title: string;

  @ApiProperty({
    description: "Detailed description of the task",
    example: "Milk, Eggs, Bread and Butter",
  })
  @IsNotEmpty({ message: "Description is required" })
  description: string;

  @ApiPropertyOptional({
    description: "Whether the task is completed",
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiProperty({
    description: "The deadline for this task",
    example: "2026-12-31T23:59:59.000Z",
  })
  @IsNotEmpty({ message: "Due date is required" })
  @IsDateString({}, { message: "Must be a valid ISO date string" })
  dueDate: string;

  @ApiPropertyOptional({
    description: "The category of the task",
    enum: TaskCategory,
    example: TaskCategory.OUTROS,
  })
  @IsOptional()
  @IsEnum(TaskCategory, { message: "Invalid category" })
  category?: TaskCategory;
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Request,
} from "@nestjs/common";
import { TasksService } from "../services/tasks.service";
import { CreateTaskDto } from "../dtos/create-task.dto";
import { UpdateTaskDto } from "../dtos/update-task.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { Request as ExpressRequest } from "express";

export interface RequestWithUser extends ExpressRequest {
  user: {
    id: number;
    email: string;
  };
}

@ApiTags("Tasks")
@ApiBearerAuth()
@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: "Creates a new task" })
  create(
    @Request() req: RequestWithUser,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(createTaskDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: "Returns all tasks" })
  findAll(@Request() req: RequestWithUser) {
    return this.tasksService.findAll(req.user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Finds a task by ID" })
  findOne(
    @Request() req: RequestWithUser,
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.tasksService.findOne(id, req.user.id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Updates an existing task" })
  update(
    @Request() req: RequestWithUser,
    @Param("id", ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, req.user.id, updateTaskDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Deletes a task by ID" })
  remove(
    @Request() req: RequestWithUser,
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.tasksService.remove(id, req.user.id);
  }
}

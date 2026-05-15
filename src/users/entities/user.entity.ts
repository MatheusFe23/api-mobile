import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Task } from "../../tasks/entities/task.entity";

@Entity("users")
export class User {
  @ApiProperty({ description: "ID único do usuário", example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: "O nome do usuário", example: "João Silva" })
  @Column()
  @IsNotEmpty({ message: "O nome é obrigatório" })
  name: string;

  @ApiProperty({ description: "O email do usuário", example: "joao@email.com" })
  @Column({ unique: true })
  @IsEmail({}, { message: "Formato de email inválido" })
  @IsNotEmpty({ message: "O email é obrigatório" })
  email: string;

  @ApiProperty({ description: "A senha do usuário", example: "123456" })
  @Column()
  @IsNotEmpty({ message: "A senha é obrigatória" })
  @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres" })
  password: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}

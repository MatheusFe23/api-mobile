import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ description: "O nome do usuário", example: "João Silva" })
  @IsNotEmpty({ message: "O nome é obrigatório" })
  name: string;

  @ApiProperty({ description: "O email do usuário", example: "joao@email.com" })
  @IsEmail({}, { message: "Formato de email inválido" })
  @IsNotEmpty({ message: "O email é obrigatório" })
  email: string;

  @ApiProperty({
    description: "A senha do usuário",
    example: "123456",
    minLength: 6,
  })
  @IsNotEmpty({ message: "A senha é obrigatória" })
  @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres" })
  password: string;
}

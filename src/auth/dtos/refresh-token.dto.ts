import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
  @ApiProperty({ description: "O token de atualização (refresh token)" })
  @IsString()
  @IsNotEmpty({ message: "O refresh token é obrigatório" })
  refresh_token: string;
}

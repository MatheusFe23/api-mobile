import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dtos/login.dto";
import { Public } from "../decorators/public.decorator";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  @ApiOperation({ summary: "Realiza o login e retorna o Token JWT" })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

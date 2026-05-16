import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../../users/services/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginDto } from "../dtos/login.dto";
import { User } from "../../users/entities/user.entity";
import { jwtConstants } from "../constants";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, "password">> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Credenciais inválidas");
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (user && isPasswordValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException("Credenciais inválidas");
  }

  async generateTokens(payload: { email: string; sub: number }) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: "15m",
      }),
      this.jwtService.signAsync(payload, {
        secret: jwtConstants.refreshSecret,
        expiresIn: "7d",
      }),
    ]);
    return { access_token, refresh_token };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const payload = { email: user.email, sub: user.id };
    const tokens = await this.generateTokens(payload);
    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.refreshSecret,
      });

      // Validar se o usuário ainda existe
      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException("Usuário não encontrado");
      }

      const newPayload = { email: user.email, sub: user.id };
      const tokens = await this.generateTokens(newPayload);
      return tokens;
    } catch (e) {
      throw new UnauthorizedException("Refresh token inválido ou expirado");
    }
  }
}

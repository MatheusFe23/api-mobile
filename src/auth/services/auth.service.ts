import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../../users/services/users.service";
import { TasksService } from "../../tasks/services/tasks.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginDto } from "../dtos/login.dto";
import { User } from "../../users/entities/user.entity";
import { Task } from "../../tasks/entities/task.entity";
import { jwtConstants } from "../constants";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tasksService: TasksService,
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

  private async getAiInsights(tasks: Task[]): Promise<any> {
    if (!tasks || tasks.length === 0) {
      return { suggestion: "Você não tem tarefas recentes para análise." };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        suggestion: "A chave da API do Gemini não está configurada. (GEMINI_API_KEY)",
      };
    }

    const prompt = `
Aqui estão minhas últimas ${tasks.length} tarefas:
${tasks.map((t) => `- Título: ${t.title}, Categoria: ${t.category}, Concluída: ${t.isCompleted}, Data: ${t.dueDate || "Sem data"}`).join("\n")}

Analise as tarefas e retorne APENAS um JSON válido com a seguinte estrutura:
{
  "delayed_tasks": ["nome da tarefa"], // Tarefas não concluídas que já passaram da data (use a data atual ${new Date().toISOString()} como base)
  "priority_task": "nome da tarefa", // A tarefa mais urgente ou importante
  "suggestion": "uma breve sugestão de como organizar meu dia ou qual deve ser a próxima"
}
`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        },
      );

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        return JSON.parse(text);
      }
      return null;
    } catch (e) {
      console.error("Erro ao obter insights da IA:", e);
      return { error: "Não foi possível obter sugestões da IA." };
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    const payload = { email: user.email, sub: user.id };
    const tokens = await this.generateTokens(payload);

    // Buscar as últimas 10 tarefas do usuário para IA
    const allTasks = await this.tasksService.findAll(user.id);
    const recentTasks = allTasks
      .sort((a, b) => b.id - a.id)
      .slice(0, 10);

    const ai_insights = await this.getAiInsights(recentTasks);

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      ai_insights,
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

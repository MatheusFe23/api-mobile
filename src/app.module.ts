import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { TasksModule } from "./tasks/tasks.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // deixa disponível em toda aplicação
    }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "database.sqlite", // Agora persistido em arquivo
      autoLoadEntities: true,
      synchronize: true, // Cria as tabelas automaticamente
    }),
    UsersModule,
    AuthModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

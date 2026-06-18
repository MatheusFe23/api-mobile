import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { TasksModule } from "./tasks/tasks.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna o ConfigModule global, sem precisar importar em outros módulos
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

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use((req, res, next) => {
    console.log(`\n[API LOGGER] Incoming: ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log(`[API LOGGER] Body:`, JSON.stringify(req.body));
    }
    const originalSend = res.send;
    res.send = function (body) {
      console.log(`[API LOGGER] Outgoing Status: ${res.statusCode}`);
      console.log(`[API LOGGER] Response:`, body);
      return originalSend.apply(this, arguments);
    };
    next();
  });

  const config = new DocumentBuilder()
    .setTitle("API Mobile CRUD")
    .setDescription("A documentação completa da API do CRUD de usuários")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, documentFactory);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap().catch((err) => {
  console.error("Error starting server", err);
});

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import env from 'src/shared/config'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor'
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // tự động loại bỏ các field ko đc khai báo decorator trong dto
      forbidNonWhitelisted: true, // throw error nếu có field ko đc khai báo decorator trong dto mà client gửi lên
      transform: true, // tự động chuyển đổi sang type đc khai báo trong dto
      transformOptions: {
        // tự động chuyển đổi sang type đc khai báo trong dto,
        // vd client gửi lên email: 123 thì sẽ tự động chuyển đổi sang type string nếu decorator của email là @IsString()
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        return new UnprocessableEntityException(
          errors.map((errors) => ({
            field: errors.property,
            error: Object.values(errors.constraints ?? {}).join(', '),
          })),
        )
      },
    }),
  )
  await app.listen(env.APP_PORT ?? 4000)
}

void bootstrap()

import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoryEntity } from './entities/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AllConfigType } from '@/config/config.type';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import fileConfig from '@/config/file.config';
import { AuthModule } from '@/auth/auth.module';
import { AuthMiddleware } from '@/auth/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity]),
    AuthModule,
    ConfigModule.forRoot({
      load: [fileConfig], // load configuration from file.config.ts
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        const storages = {
          local: () =>
            diskStorage({
              destination: './files',
              filename: (request, file, callback) => {
                callback(
                  null,
                  `${randomStringGenerator()}.${file.originalname
                    .split('.')
                    .pop()
                    ?.toLowerCase()}`,
                );
              },
            }),
        };

        return {
          fileFilter: (request, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
              return callback(
                new HttpException(
                  {
                    error: 'Unprocessable Entity',
                    message:
                      'Unable to upload file: Invalid file format. Only JPG, JPEG, PNG, and GIF files are allowed.',
                    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                  },
                  HttpStatus.UNPROCESSABLE_ENTITY,
                ),
                false,
              );
            }
            callback(null, true);
          },
          storage:
            storages[
              configService.getOrThrow('file.driver', { infer: true })
            ](),
          limits: {
            fileSize: configService.get<number>('file.maxFileSize', {
              infer: true,
            }),
          },
        };
      },
    }),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, AuthMiddleware],
})
export class CategoryModule {}

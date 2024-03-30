import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { AuthModule } from '@/auth/auth.module';
import { AuthMiddleware } from '@/auth/auth.middleware';
import { IsExist } from '@/utils/validators/is-exists.validator';
import { IsNotExist } from '@/utils/validators/is-not-exists.validator';
import { FilesModule } from '@/files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity]),
    AuthModule,
    FilesModule,
  ],
  controllers: [CategoryController],
  providers: [IsExist, IsNotExist, CategoryService, AuthMiddleware],
  exports: [CategoryService],
})
export class CategoryModule {}

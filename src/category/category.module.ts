import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule
import { AuthMiddleware } from '../auth/auth.middleware'; // Import AuthMiddleware
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AuthModule],
  controllers: [CategoryController],
  providers: [CategoryService, AuthMiddleware],
})
export class CategoryModule {}

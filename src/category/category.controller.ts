import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@/auth/auth.guard';
import { ApiResponse } from '@/utils/api-response';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NullableType } from '@/utils/types/nullable.type';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { calculatePagination } from '@/utils/calculate-pagination';

@UseGuards(AuthGuard) // Make AuthGuard in here
@Controller({
  path: 'categories',
  version: '1',
})
@ApiTags('Categories')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ): Promise<{
    data: CategoryEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.categoryService.findAll({ page, limit }, search);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id') id: CategoryEntity['id'],
  ): Promise<NullableType<CategoryEntity>> {
    return this.categoryService.findOne({ id });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: CategoryEntity['id'],
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  //SoftDelete
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: CategoryEntity['id']): Promise<void> {
    return this.categoryService.softDelete(id);
  }
}

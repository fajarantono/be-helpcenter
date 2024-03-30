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
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@/auth/auth.guard';
import { ApiResponse } from '@/utils/api-response';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StandardPaginationResultType } from '@/utils/types/standard-pagination-result.type';
import { standardPagination } from '@/utils/standard-pagination';
import { NullableType } from '@/utils/types/nullable.type';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { FilesService } from '@/files/files.services';
import { IPaginationInfo } from '@/utils/types/pagination-info.type';
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
  create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ): Promise<CategoryEntity> {
    if (limit > 50) {
      limit = 50;
    }

    const totalData = await this.categoryService.standardCount();
    const items = await this.categoryService.findManyWithPagination({
      page,
      limit,
    },
      search,
    );

    const paginationInfo = calculatePagination(totalData, page, limit);
    return ApiResponse.create(null, items, paginationInfo);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('id') id: CategoryEntity['id'],
  ): Promise<NullableType<CategoryEntity>> {
    const category = await this.categoryService.findOne({ id });

    const results = category ? category : {};

    return ApiResponse.create(null, results);
  }

  // @Patch(':id')
  // @HttpCode(HttpStatus.OK)
  // @UseInterceptors(FileInterceptor('icon'))
  // update(
  //   @Param('id') id: CategoryEntity['id'],
  //   @UploadedFile() iconFile: Express.Multer.File,
  //   @Body() updateCategoryDto: UpdateCategoryDto,
  // ): Promise<CategoryEntity> {
  //   if (iconFile) {
  //     return this.categoryService.update(id, iconFile, updateCategoryDto);
  //   } else {
  //     return this.categoryService.update(id, null, updateCategoryDto);
  //   }
  // }

  //SoftDelete
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: CategoryEntity['id']): Promise<void> {
    return this.categoryService.softDelete(id);
  }
}

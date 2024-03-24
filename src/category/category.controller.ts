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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StandardPaginationResultType } from '@/utils/types/standard-pagination-result.type';
import { standardPagination } from '@/utils/standard-pagination';
import { NullableType } from '@/utils/types/nullable.type';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(AuthGuard) // Make AuthGuard in here
@Controller({
  path: 'categories',
  version: '1',
})
@ApiTags('Categories')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('icon'))
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() iconFile: Express.Multer.File,
  ): Promise<CategoryEntity> {
    if (!iconFile) {
      throw new BadRequestException('Icon file is required.');
    }

    const iconFileName = iconFile.filename;

    return this.categoryService.create(createCategoryDto, iconFileName);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<StandardPaginationResultType<CategoryEntity>> {
    if (limit > 50) {
      limit = 50;
    }

    return standardPagination(
      await this.categoryService.findManyWithPagination({
        page,
        limit,
        offset,
      }),
      await this.categoryService.standardCount(),
    );

    //return this.categoryService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id') id: CategoryEntity['id'],
  ): Promise<NullableType<CategoryEntity>> {
    return this.categoryService.findOne({ id });
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

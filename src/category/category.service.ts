import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { EntityCondition } from '@/utils/types/entity-condition.type';
import { NullableType } from '@/utils/types/nullable.type';
import { ApiResponse } from '@/utils/api-response';
import { calculatePagination } from '@/utils/calculate-pagination';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.save(category);

      return ApiResponse.create(
        { code: HttpStatus.CREATED, message: 'Category created successfully' },
        null,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    paginationOptions: IPaginationOptions,
    search?: string,
  ): Promise<{
    data: CategoryEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const { page, limit } = paginationOptions;

      const [data, total] = await this.categoryRepository
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.icon', 'icon')
        .where('category.deleted_at IS NULL')
        .andWhere(
          search ? 'category.name LIKE :search' : '1=1',
          search ? { search: `%${search}%` } : {},
        )
        .select([
          'category.id',
          'category.name',
          'category.slug',
          'category.published',
          'category.created_at',
          'icon.id',
          'icon.path',
        ])
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('category.created_at', 'DESC')
        .getManyAndCount();

      const paginationInfo = calculatePagination(total, page, limit);

      return ApiResponse.create(null, data, paginationInfo);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(
    fields: EntityCondition<CategoryEntity>,
  ): Promise<NullableType<CategoryEntity>> {
    try {
      const queryBuilder = this.categoryRepository
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.icon', 'icon')
        .select([
          'category.id',
          'category.name',
          'category.slug',
          'category.published',
          'category.created_at',
          'icon.id',
          'icon.path',
        ])
        .where(fields)
        .andWhere('category.deleted_at IS NULL');

      const category = await queryBuilder.getOne();
      const results = category ? category : {};

      return ApiResponse.create({ code: HttpStatus.OK, message: '' }, results);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: CategoryEntity['id'],
    payload: DeepPartial<CategoryEntity>,
  ): Promise<CategoryEntity> {
    try {
      await this.categoryRepository.save(
        this.categoryRepository.create({
          id,
          ...payload,
        }),
      );

      return ApiResponse.create(
        { code: HttpStatus.OK, message: 'Category updated successfully' },
        null,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Internal server error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async softDelete(id: CategoryEntity['id']): Promise<void> {
    try {
      await this.categoryRepository.softDelete(id);

      return ApiResponse.create(
        { code: HttpStatus.OK, message: 'Category deleted successfully' },
        null,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Internal server error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: CategoryEntity['id']) {
    try {
      await this.categoryRepository.delete(id);
      return ApiResponse.create(
        { code: HttpStatus.OK, message: 'Category deleted successfully' },
        null,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          message: 'Internal server error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

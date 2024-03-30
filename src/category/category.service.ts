import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { IPaginationOptions } from '@/utils/types/pagination-options';
import { EntityCondition } from '@/utils/types/entity-condition.type';
import { NullableType } from '@/utils/types/nullable.type';
import { HttpExceptionFilter } from '@/filters/http-exception.filter';
// import { FilesService } from '@/files/files.services';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const slugBase = this.generateSlug(createCategoryDto.name); // Generate slug from name
    let slug = slugBase;
    let counter = 0;

    // Check if the generated slug already exists
    while (await this.categoryRepository.findOne({ where: { slug } })) {
      counter++;
      slug = `${slugBase}-${counter}`;
    }

    // const newCategory = this.categoryRepository.create({
    //   ...createCategoryDto,
    //   slug: slug,
    // });

    return this.categoryRepository.save(createCategoryDto);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  findManyWithPagination(
    paginationOptions: IPaginationOptions,
    search?: string,
  ): Promise<CategoryEntity[]> {
    const offset = (paginationOptions.page - 1) * paginationOptions.limit;
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.icon', 'icon')
      .where('category.deleted_at IS NULL')
      .orderBy('category.created_at', 'DESC')
      .select([
        'category.id',
        'category.name',
        'category.slug',
        'category.published',
        'category.created_at',
        'icon.id',
        'icon.path',
      ]);

    if (search) {
      query.andWhere('LOWER(category.name) LIKE LOWER(:name)', {
        name: `%${search}%`,
      });
    }

    return query.skip(offset).take(paginationOptions.limit).getMany();
  }

  standardCount(): Promise<number> {
    return this.categoryRepository.count();
  }

  async findOne(
    fields: EntityCondition<CategoryEntity>,
  ): Promise<NullableType<CategoryEntity>> {
    try {
      const query = this.categoryRepository
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

      const category = await query.getOne();

      return category;
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

  // async update(
  //   id: CategoryEntity['id'],
  //   iconFile: Express.Multer.File,
  //   payload: DeepPartial<CategoryEntity>,
  // ): Promise<CategoryEntity> {
  //   try {
  //     const categoryToUpdate = await this.categoryRepository.findOne({
  //       where: { id },
  //     });

  //     if (!categoryToUpdate) {
  //       throw new HttpException(
  //         {
  //           error: 'Not found',
  //           message: 'Category not found',
  //           statusCode: HttpStatus.NOT_FOUND,
  //         },
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     const name = payload.name;

  //     if (!name) {
  //       throw new BadRequestException('Name is required for updating category');
  //     }

  //     let slug = this.generateSlug(name); // Generate slug from updated name
  //     let counter = 0;
  //     let uniqueSlugFound = false;

  //     // Check if the generated slug already exists
  //     while (!uniqueSlugFound) {
  //       const existingCategory = await this.categoryRepository.findOne({
  //         where: { slug },
  //       });

  //       if (!existingCategory || existingCategory.id === id) {
  //         uniqueSlugFound = true;
  //       } else {
  //         counter++;
  //         slug = `${this.generateSlug(name)}-${counter}`;
  //       }
  //     }

  //     let updatedCategory: CategoryEntity;

  //     if (iconFile) {
  //       // Hapus file ikon lama
  //       if (categoryToUpdate.icon) {
  //         const iconPath = `./files/${categoryToUpdate.icon}`;
  //         if (fs.existsSync(iconPath)) {
  //           fs.unlinkSync(iconPath);
  //         }
  //       }

  //       // Upload file ikon baru
  //       const iconFileName = await this.filesService.uploadFile(iconFile);

  //       updatedCategory = await this.categoryRepository.save({
  //         ...categoryToUpdate,
  //         ...payload,
  //         slug,
  //         icon: iconFileName,
  //       });
  //     } else {
  //       updatedCategory = await this.categoryRepository.save({
  //         ...categoryToUpdate,
  //         ...payload,
  //         slug,
  //       });
  //     }

  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       throw error;
  //     }
  //     throw new HttpException(
  //       {
  //         error: 'Internal server error',
  //         message: 'Request invalid',
  //         statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //       },
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async softDelete(id: CategoryEntity['id']): Promise<void> {
    await this.categoryRepository.softDelete(id);
  }

  remove(id: CategoryEntity['id']) {
    return this.categoryRepository.delete(id);
  }

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }
}

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
import * as fs from 'fs';
// import { FilesService } from '@/files/files.services';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    // private readonly filesService: FilesService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    iconFileName: string,
  ): Promise<CategoryEntity> {
    const slugBase = this.generateSlug(createCategoryDto.name); // Generate slug from name
    let slug = slugBase;
    let counter = 0;

    // Check if the generated slug already exists
    while (await this.categoryRepository.findOne({ where: { slug } })) {
      counter++;
      slug = `${slugBase}-${counter}`;
    }

    const newCategory = this.categoryRepository.create({
      name: createCategoryDto.name,
      slug: slug,
      icon: iconFileName, // Assuming icon is the file name
    });

    return this.categoryRepository.save(newCategory);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  findManyWithPagination(
    paginationOptions: IPaginationOptions,
  ): Promise<CategoryEntity[]> {
    return this.categoryRepository.find({
      skip: paginationOptions.offset,
      take: paginationOptions.limit,
    });
  }

  standardCount(): Promise<number> {
    return this.categoryRepository.count();
  }

  async findOne(
    fields: EntityCondition<CategoryEntity>,
  ): Promise<NullableType<CategoryEntity>> {
    try {
      const category = await this.categoryRepository.findOne({
        where: fields,
      });
      if (!category) {
        throw new HttpException(
          {
            error: 'Not found',
            message: 'Category not found',
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return category;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          error: 'Internal server error',
          message: 'Request invalid',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
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

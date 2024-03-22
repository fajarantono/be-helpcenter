import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Repository } from 'typeorm';
import { EntityCondition } from '@/utils/types/entity-condition.type';
import { NullableType } from '@/utils/types/nullable.type';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const newCategory = this.categoryRepository.save(
          this.categoryRepository.create(createCategoryDto),
        );
    
        return newCategory;
    }

    findAll() {
        return this.categoryRepository.find();
    }

    findOne(fields: EntityCondition<Category>): Promise<NullableType<Category>> {
        return this.categoryRepository.findOne({
          where: fields,
        });
    }

}

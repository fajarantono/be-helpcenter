import { IsNotEmpty, IsString } from 'class-validator';
export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  icon: any;

  published?: boolean = true;
}

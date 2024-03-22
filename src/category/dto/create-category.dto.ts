import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { lowerCaseTransformer } from "src/utils/transformers/lower-case.transformer";

export class CreateCategoryDto {
    @IsNotEmpty()
    name: string;

    @Transform(lowerCaseTransformer)
    @IsNotEmpty()
    slug: string;

    @ApiProperty({ example: 'icon-url.jpg' })
    @IsNotEmpty()
    @IsString()
    icon: string;

}
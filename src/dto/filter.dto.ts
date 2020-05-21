import { IsArray, IsDate, IsDateString, IsEnum, IsIn, IsISO8601, IsOptional, IsString } from 'class-validator';
import { Limit } from '../enums/limit.enum';
import { Sort } from '../enums/sort.enum';
import { ApiProperty } from '@nestjs/swagger';

export class FilterDto {
  @ApiProperty({
    name: 'languages[]',
    required: false,
    isArray: true,
    type: 'string',
    description: 'Filter by programming language'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @ApiProperty({ required: false, default: '10' })
  @IsOptional()
  @IsEnum(Limit)
  limit: Limit;

  @ApiProperty({ required: false, default: Sort.STARS_DESC })
  @IsOptional()
  @IsEnum(Sort)
  sortBy: Sort;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  text: string;

  @ApiProperty({ required: false, description: 'Format: YYYY-MM-DD' })
  @IsOptional()
  @IsISO8601()
  createdAfter: string;

  @ApiProperty({ required: false, description: 'Format: YYYY-MM-DD' })
  @IsOptional()
  @IsISO8601()
  createdBefore: string;
}
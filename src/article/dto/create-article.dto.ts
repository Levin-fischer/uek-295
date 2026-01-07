import { ApiProperty } from '@nestjs/swagger';
export class CreateArticleDto {
  @ApiProperty({ description: 'Article Name', example: 'Apple' })
  articleName!: string;
  @ApiProperty({
    description: 'Article Description',
    example: 'Apple is a fruit',
  })
  articleDescription!: string;
  @ApiProperty({ description: 'Article Price', example: 10 })
  articlePrice!: number;
}

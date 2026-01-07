import { ApiProperty } from '@nestjs/swagger';
export class UpdateArticleDto {
  @ApiProperty({
    description: 'Article Name',
    example: 'Apple',
    required: false,
  })
  articleName?: string;
  @ApiProperty({
    description: 'Article Description',
    example: 'Apple is a fruit',
    required: false,
  })
  articleDescription?: string;
  @ApiProperty({ description: 'Article Price', example: 10, required: false })
  articlePrice?: number;
}

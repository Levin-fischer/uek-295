// src/user/dto/return-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ReturnUserDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'user' })
  username!: string;

  @ApiProperty({ example: 'user@local.ch' })
  email!: string;

  @ApiProperty({ example: 'false' })
  isAdmin!: boolean;

  @ApiProperty({
    description: 'createdAt',
    example: '2021-01-01T00:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'updatedAt',
    example: '2021-01-01T00:00:00.000Z',
  })
  updatedAt!: Date;

  @ApiProperty({ description: 'version', example: 1 })
  version!: number;

  // hier könnten wir auch statt der Id den Namen zurückgeben
  @ApiProperty({ description: 'createdById', example: 1 })
  createdById!: number;

  @ApiProperty({ description: 'updatedById', example: 1 })
  updatedById!: number;
}

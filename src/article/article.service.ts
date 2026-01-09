import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ReturnArticleDto } from './dto/return-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly repo: Repository<ArticleEntity>,
  ) {}
  private entityToDto(entity: ArticleEntity): ReturnArticleDto {
    return {
      id: entity.id,
      articleName: entity.articleName,
      articleDescription: entity.articleDescription,
      articlePrice: entity.articlePrice,
    } as ReturnArticleDto;
  }
  async create(createDto: CreateArticleDto): Promise<ReturnArticleDto> {
    const createEntity = this.repo.create(createDto);
    const savedEntity = await this.repo.save(createEntity);
    return this.entityToDto(savedEntity);
  }
  async findAll(): Promise<ReturnArticleDto[]> {
    // find all entries
    const arr = await this.repo.find();
    // convert each entry to a DTO
    return arr.map((e) => this.entityToDto(e));
  }
  async findOne(id: number): Promise<ReturnArticleDto> {
    const findEntity = await this.repo.findOneBy({ id });
    if (!findEntity) throw new NotFoundException(`Article ${id} not found`);
    return this.entityToDto(findEntity);
  }
  async replace(
    id: number,
    returnArticleDto: ReturnArticleDto,
  ): Promise<ReturnArticleDto> {
    const existingEntity = await this.repo.findOneBy({ id });
    if (!existingEntity) throw new NotFoundException(`Article ${id} not found`);
    const replacedEntity = await this.repo.save({
      ...existingEntity,
      ...returnArticleDto,
      id,
    });
    return this.entityToDto(replacedEntity);
  }
  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ReturnArticleDto> {
    const existingEntity = await this.repo.findOneBy({ id });
    if (!existingEntity) throw new NotFoundException(`Article ${id} not found`);
    const updatedEntity = await this.repo.save({
      ...existingEntity,
      ...updateArticleDto,
      id,
    });
    return this.entityToDto(updatedEntity);
  }
  async remove(id: number): Promise<ReturnArticleDto> {
    const existing = await this.repo.findOneBy({ id });
    if (!existing) throw new NotFoundException(`Article ${id} not found`);
    await this.repo.remove(existing);
    return this.entityToDto(existing);
  }
}

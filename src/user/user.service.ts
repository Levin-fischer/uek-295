// src/user/user.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordService } from './password.service';
import { ReturnUserDto } from './dto/return-user.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
    private readonly passwordService: PasswordService,
  ) {
    // you could add the initial data here, but it's not recommended in the constructor doing some work.
    // Recommendation: do it after the bootstrap of the application in the main.ts file
  }

  // Vorbereitung für Authentifizierung, wir benötigen diese Methode, um einen User anhand des Benutzernamens zu finden und wir benötigen den Hash zurück für die Prüfung
  async findOneEntityByUsername(username: string) {
    const findEntity = await this.repo.findOneBy({ username });
    if (!findEntity) {
      throw new NotFoundException(`User ${username} not found`);
    }
    return findEntity;
  }

  private entityToDto(entity: UserEntity): ReturnUserDto {
    // hint: Rückgabe ohne Password oder PasswordHash
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      isAdmin: entity.isAdmin,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      version: entity.version,
      createdById: entity.createdById,
      updatedById: entity.updatedById,
    } as ReturnUserDto;
  }

  async create(createDto: CreateUserDto) {
    const createEntity = this.repo.create(createDto);
    // check if the username not already exists
    const existing = await this.findOneEntityByUsername(createDto.username);
    if (existing) {
      throw new ConflictException(
        `Username ${createDto.username} already exists`,
      );
    }
    // create the password hash
    createEntity.passwordHash = await this.passwordService.hashPassword(
      createDto.password,
    );
    // todo: must be fixed later with the proper id of the current user
    createEntity.createdById = -1;
    createEntity.updatedById = -1;
    const savedEntity = await this.repo.save(createEntity);
    return this.entityToDto(savedEntity);
  }

  async findAll() {
    // find all entries
    const arr = await this.repo.find();
    // convert each entry to a DTO
    return arr.map((e) => this.entityToDto(e));
  }

  async findOne(id: number) {
    const findEntity = await this.repo.findOneBy({ id });
    if (!findEntity) throw new NotFoundException(`User ${id} not found`);
    return this.entityToDto(findEntity);
  }

  async replace(id: number, returnDto: ReturnUserDto): Promise<ReturnUserDto> {
    const existingEntity = await this.repo.findOneBy({ id });
    if (!existingEntity) throw new NotFoundException(`User ${id} not found`);
    const replacedEntity = await this.repo.save({
      ...existingEntity,
      ...returnDto,
      id,
    });
    return this.entityToDto(replacedEntity);
  }

  async update(id: number, updateUserAdminDto: UpdateUserAdminDto) {
    // only administrators can update users
    const existingEntity = await this.repo.findOneBy({ id });
    if (!existingEntity) throw new NotFoundException(`User ${id} not found`);
    const updatedEntity = await this.repo.save({
      ...existingEntity,
      ...updateUserAdminDto,
      id,
    });
    return this.entityToDto(updatedEntity);
  }

  async remove(id: number) {
    // todo: only administrators can delete users
    const existing = await this.repo.findOneBy({ id });
    if (!existing) throw new NotFoundException(`User ${id} not found`);
    await this.repo.remove(existing);
    return this.entityToDto(existing);
  }
}

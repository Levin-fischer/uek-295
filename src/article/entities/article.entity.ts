import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('article')
export class ArticleEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;
  @Column({ type: 'varchar', length: 255 })
  articleName!: string;
  @Column({ type: 'varchar' })
  articleDescription!: string;
  @Column({ type: 'double' })
  articlePrice!: number;
}

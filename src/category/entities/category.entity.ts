import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';

  @Entity()
  export class Category {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @Column()
    slug: string;

    @Column()
    icon: string;
  
    @Column({ default: true })
    published?: boolean;

    @Column({ default: true })
    isActive?: boolean;
  
    @CreateDateColumn()
    createdAt?: Date;
  
    @UpdateDateColumn()
    updatedAt?: Date;
  }
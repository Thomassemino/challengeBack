import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Category } from '../entities/category.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async seed(): Promise<void> {
    await this.seedAdminUser();
    await this.seedCategories();
  }

  private async seedAdminUser(): Promise<void> {
    const adminExists = await this.userRepository.findOne({
      where: { username: 'admin' },
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = this.userRepository.create({
        username: 'admin',
        password: hashedPassword,
        isActive: true,
      });

      await this.userRepository.save(adminUser);
      console.log('✅ Admin user created successfully');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
  }

  private async seedCategories(): Promise<void> {
    const categories = [
      { name: 'Trabajo', color: 'blue' },
      { name: 'Personal', color: 'green' },
      { name: 'Urgente', color: 'red' },
      { name: 'Ideas', color: 'purple' },
      { name: 'Otro', color: 'gray' },
    ];

    for (const categoryData of categories) {
      const categoryExists = await this.categoryRepository.findOne({
        where: { name: categoryData.name },
      });

      if (!categoryExists) {
        const category = this.categoryRepository.create({
          name: categoryData.name,
          color: categoryData.color,
          description: `Categoría ${categoryData.name}`,
        });

        await this.categoryRepository.save(category);
        console.log(`✅ Category '${categoryData.name}' created successfully`);
      } else {
        console.log(`ℹ️  Category '${categoryData.name}' already exists`);
      }
    }
  }
}
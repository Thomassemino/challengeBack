import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Note } from '../entities/note.entity';
import { Category } from '../entities/category.entity';
import { CreateNoteDto } from '../dto/notes/create-note.dto';
import { UpdateNoteDto } from '../dto/notes/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const { categoryIds, ...noteData } = createNoteDto;
    
    let categories: Category[] = [];
    if (categoryIds && categoryIds.length > 0) {
      categories = await this.categoryRepository.findBy({
        id: In(categoryIds),
      });
    }

    const note = this.noteRepository.create({
      ...noteData,
      categories,
    });

    return this.noteRepository.save(note);
  }

  async findAll(): Promise<Note[]> {
    return this.noteRepository.find({
      relations: ['categories'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActive(): Promise<Note[]> {
    return this.noteRepository.find({
      where: { archived: false },
      relations: ['categories'],
      order: { createdAt: 'DESC' },
    });
  }

  async findArchived(): Promise<Note[]> {
    return this.noteRepository.find({
      where: { archived: true },
      relations: ['categories'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCategory(categoryId: number): Promise<Note[]> {
    return this.noteRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.categories', 'category')
      .where('category.id = :categoryId', { categoryId })
      .orderBy('note.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.findOne(id);
    const { categoryIds, ...noteData } = updateNoteDto;

    if (categoryIds) {
      const categories = await this.categoryRepository.findBy({
        id: In(categoryIds),
      });
      note.categories = categories;
    }

    Object.assign(note, noteData);
    return this.noteRepository.save(note);
  }

  async archive(id: string): Promise<Note> {
    const note = await this.findOne(id);
    note.archived = true;
    return this.noteRepository.save(note);
  }

  async unarchive(id: string): Promise<Note> {
    const note = await this.findOne(id);
    note.archived = false;
    return this.noteRepository.save(note);
  }

  async assignCategories(id: string, categoryIds: number[]): Promise<Note> {
    const note = await this.findOne(id);
    const categories = await this.categoryRepository.findBy({
      id: In(categoryIds),
    });

    note.categories = categories;
    return this.noteRepository.save(note);
  }

  async removeCategoryFromNote(noteId: string, categoryId: number): Promise<Note> {
    const note = await this.findOne(noteId);
    
    note.categories = note.categories.filter(
      (category) => category.id !== categoryId,
    );

    return this.noteRepository.save(note);
  }

  async remove(id: string): Promise<void> {
    const note = await this.findOne(id);
    await this.noteRepository.remove(note);
  }
}
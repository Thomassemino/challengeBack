import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { NotesService } from '../services/notes.service';
import { CreateNoteDto } from '../dto/notes/create-note.dto';
import { UpdateNoteDto } from '../dto/notes/update-note.dto';
import { NoteResponseDto } from '../dto/notes/note-response.dto';
import { AssignCategoriesDto } from '../dto/notes/assign-categories.dto';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({
    status: 201,
    type: NoteResponseDto,
  })
  @ApiResponse({ status: 400 })
  async create(@Body() createNoteDto: CreateNoteDto): Promise<NoteResponseDto> {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes' })
  @ApiQuery({
    name: 'category',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    type: [NoteResponseDto],
  })
  async findAll(@Query('category') categoryId?: number): Promise<NoteResponseDto[]> {
    if (categoryId) {
      return this.notesService.findByCategory(categoryId);
    }
    return this.notesService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active (non-archived) notes' })
  @ApiResponse({
    status: 200,
    type: [NoteResponseDto],
  })
  async findActive(): Promise<NoteResponseDto[]> {
    return this.notesService.findActive();
  }

  @Get('archived')
  @ApiOperation({ summary: 'Get all archived notes' })
  @ApiResponse({
    status: 200,
    type: [NoteResponseDto],
  })
  async findArchived(): Promise<NoteResponseDto[]> {
    return this.notesService.findArchived();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a note by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    type: NoteResponseDto,
  })
  @ApiResponse({ status: 404 })
  async findOne(@Param('id') id: string): Promise<NoteResponseDto> {
    return this.notesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a note' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    type: NoteResponseDto,
  })
  @ApiResponse({ status: 404 })
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<NoteResponseDto> {
    return this.notesService.update(id, updateNoteDto);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive a note' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    type: NoteResponseDto,
  })
  @ApiResponse({ status: 404 })
  async archive(@Param('id') id: string): Promise<NoteResponseDto> {
    return this.notesService.archive(id);
  }

  @Patch(':id/unarchive')
  @ApiOperation({ summary: 'Unarchive a note' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    type: NoteResponseDto,
  })
  @ApiResponse({ status: 404 })
  async unarchive(@Param('id') id: string): Promise<NoteResponseDto> {
    return this.notesService.unarchive(id);
  }

  @Patch(':id/categories')
  @ApiOperation({ summary: 'Assign categories to a note' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    type: NoteResponseDto,
  })
  @ApiResponse({ status: 404 })
  async assignCategories(
    @Param('id') id: string,
    @Body() assignCategoriesDto: AssignCategoriesDto,
  ): Promise<NoteResponseDto> {
    return this.notesService.assignCategories(id, assignCategoriesDto.categoryIds);
  }

  @Delete(':id/categories/:categoryId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a category from a note' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'categoryId', type: Number })
  @ApiResponse({
    status: 200,
    type: NoteResponseDto,
  })
  @ApiResponse({ status: 404 })
  async removeCategoryFromNote(
    @Param('id') noteId: string,
    @Param('categoryId') categoryId: number,
  ): Promise<NoteResponseDto> {
    return this.notesService.removeCategoryFromNote(noteId, +categoryId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a note' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404 })
  async remove(@Param('id') id: string): Promise<void> {
    return this.notesService.remove(id);
  }
}
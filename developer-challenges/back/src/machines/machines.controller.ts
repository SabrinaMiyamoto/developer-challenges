import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  UseGuards
} from '@nestjs/common';
import { MachinesService } from './machines.service';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';
import { Machine } from './schema/machine.schemas'; 
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard'; 

@Controller('machines')
@UseGuards(JwtAuthGuard)
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMachineDto: CreateMachineDto): Promise<Machine> {
    return await this.machinesService.create(createMachineDto);
  }

  @Get()
  async findAll( // Adicionar async
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(5), ParseIntPipe) pageSize: number,
    @Query('sortBy', new DefaultValuePipe('name')) sortBy: string,
    @Query('sortDirection', new DefaultValuePipe('asc')) sortDirection: 'asc' | 'desc',
    @Query('searchTerm') searchTerm?: string,
  ): Promise<{ data: Machine[]; total: number }> { 

    const machineSortBy: keyof Machine = sortBy as keyof Machine;
    return await this.machinesService.findAll(
      page,
      pageSize,
      machineSortBy,
      sortDirection,
      searchTerm,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Machine> { 

    return await this.machinesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMachineDto: UpdateMachineDto): Promise<Machine> {
    return await this.machinesService.update(id, updateMachineDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<any> {
    return await this.machinesService.remove(id);
  }}
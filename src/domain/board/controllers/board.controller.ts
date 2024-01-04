import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

import { BoardService } from '../providers';
import { CreateBoardDto, UpdateBoardDto } from '../dto';
import { BoardGuard } from '../guards';
import { Role, Roles } from 'src/common';
import { Board } from '../board.interface';
import { SuccessResponseDto } from 'src/common/dto';

@ApiBearerAuth()
@ApiTags('Board')
@UseGuards(BoardGuard)
@Controller('board')
export class BoardController {
  constructor(private readonly board: BoardService) {}

  @ApiBody({ type: CreateBoardDto })
  @Roles(Role.SuperAdmin)
  @Post()
  public async create(@Body() boardData: CreateBoardDto): Promise<SuccessResponseDto> {
    return { isSuccess: await this.board.create(boardData) };
  }

  @ApiParam({ name: 'board_name', required: true, description: 'Admin Board' })
  @Get('/:board_name')
  public async findOne(@Param('board_name') boardName: string): Promise<Board> {
    return await this.board.findByBoardName(boardName);
  }

  @ApiBody({ type: UpdateBoardDto })
  @Roles(Role.SuperAdmin)
  @Put()
  public async update(@Body() boardData: UpdateBoardDto): Promise<SuccessResponseDto> {
    return { isSuccess: await this.board.update(boardData) };
  }

  @ApiParam({ name: 'board_name', required: true, description: 'Admin Board' })
  @Roles(Role.SuperAdmin)
  @Delete('/:board_name')
  public async delete(@Param('board_name') boardName: string): Promise<SuccessResponseDto> {
    return { isSuccess: await this.board.delete(boardName) };
  }

  @ApiParam({ name: 'board_id', required: true, description: '1' })
  @Roles(Role.SuperAdmin)
  @Post('/restore/:board_id')
  public async restore(@Param('board_id') boardId: number): Promise<SuccessResponseDto> {
    return { isSuccess: await this.board.restore(boardId) };
  }
}

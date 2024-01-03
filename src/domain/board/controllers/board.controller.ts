import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

import { BoardService } from '../providers';
import { CreateBoardDto, UpdateBoardDto } from '../dto';
import { BoardGuard } from '../guards';
import { Role, Roles } from 'src/common';
import { Board } from '../board.interface';

@ApiBearerAuth()
@ApiTags('Board')
@UseGuards(BoardGuard)
@Controller('board')
export class BoardController {
  constructor(private readonly board: BoardService) {}

  @ApiBody({ type: CreateBoardDto })
  @Roles(Role.SuperAdmin)
  @Post()
  public async create(@Body() boardData: CreateBoardDto): Promise<boolean> {
    const isSuccess = await this.board.create(boardData);
    return isSuccess;
  }

  @ApiParam({ name: 'board_name', required: true, description: 'Admin Board' })
  @Get('/:board_name')
  public async findOne(@Param('board_name') boardName: string): Promise<Board> {
    const board = await this.board.findByBoardName(boardName);
    return board;
  }

  @ApiBody({ type: UpdateBoardDto })
  @Roles(Role.SuperAdmin)
  @Put()
  public async update(@Body() boardData: UpdateBoardDto) {
    const isSuccess = await this.board.update(boardData);
    return isSuccess;
  }

  @ApiParam({ name: 'board_name', required: true, description: 'Admin Board' })
  @Roles(Role.SuperAdmin)
  @Delete('/:board_name')
  public async delete(@Param('board_name') boardName: string): Promise<boolean> {
    const isSuccess = await this.board.delete(boardName);
    return isSuccess;
  }

  @ApiParam({ name: 'board_id', required: true, description: '1' })
  @Roles(Role.SuperAdmin)
  @Post('/restore/:board_id')
  public async restore(@Param('board_id') boardId: number): Promise<boolean> {
    const isSuccess = await this.board.restore(boardId);
    return isSuccess;
  }
}

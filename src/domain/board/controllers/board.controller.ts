import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

import { BoardService } from '../providers';
import { CreateBoardDto, UpdateBoardDto } from '../dto';
import { BoardGuard } from '../guards';
import { Role, Roles } from 'src/common';

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

  @ApiBody({ type: UpdateBoardDto })
  @Put()
  public async update(@Body() boardData: UpdateBoardDto) {
    const isSuccess = await this.board.update(boardData);
    return isSuccess;
  }
}

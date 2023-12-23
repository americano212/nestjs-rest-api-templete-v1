import { Body, Controller, Post } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardService } from './providers';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Board')
@Controller('board')
export class BoardController {
  constructor(private readonly board: BoardService) {}
  @Post()
  public async addBoard(@Body() createBoardData: CreateBoardDto): Promise<boolean> {
    const isSuccess = await this.board.create(createBoardData);
    return isSuccess;
  }
}

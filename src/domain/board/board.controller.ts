import { Body, Controller, Get, Ip, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { BoardService } from './providers';
import { CreateBoardDto, CreateContentDto } from './dto';
import { ContentService } from './providers/content.service';
import { JwtAuthGuard, Payload } from 'src/auth';
import { ReqUser } from 'src/common';
import { Content } from './board.interface';

@ApiTags('Board')
@Controller('board')
export class BoardController {
  constructor(
    private readonly board: BoardService,
    private readonly content: ContentService,
  ) {}
  @ApiBody({ type: CreateBoardDto })
  @Post()
  public async createBoard(@Body() createBoardData: CreateBoardDto): Promise<boolean> {
    const isSuccess = await this.board.create(createBoardData);
    return isSuccess;
  }

  // TODO Add Role Guard
  @ApiBearerAuth()
  @ApiBody({ type: CreateContentDto })
  @ApiParam({ name: 'board_name', required: true, description: 'Test Board' })
  @Post('/:board_name')
  @UseGuards(JwtAuthGuard)
  public async createContent(
    @Param('board_name') board_name: string,
    @Body() createContentData: CreateContentDto,
    @Ip() ip: string,
    @ReqUser() user: Payload,
  ): Promise<boolean> {
    const contentData: Content = {
      ...createContentData,
      ip,
      author: user.username,
    };
    const isSuccess = await this.content.create(board_name, contentData);
    return isSuccess;
  }

  @ApiQuery({ name: 'page', required: false, description: '1' })
  @ApiParam({ name: 'board_name', required: true, description: 'Test Board' })
  @Get('/:board_name')
  public async findContentByBoardName(
    @Param('board_name') board_name: string,
    @Query('page') page: number = 1,
  ) {
    const result = await this.content.findByBoardName(board_name, Number(page));
    return result;
  }
}

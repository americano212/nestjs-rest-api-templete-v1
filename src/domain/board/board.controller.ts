import { Body, Controller, Get, Ip, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { BoardService } from './providers';
import { CreateBoardDto, CreateContentDto } from './dto';
import { ContentService } from './providers/content.service';
import { JwtAuthGuard, Payload } from 'src/auth';
import { ReqUser } from 'src/common';
import { PageDto, PageOptionsDto } from './dto/pagination';
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

  @ApiQuery({ name: 'page', required: false, description: '1' })
  @ApiQuery({ name: 'take', required: false, description: '10' })
  @ApiParam({ name: 'board_name', required: true, description: 'Test Board' })
  @Get('/:board_name')
  public async findContentsByBoardName(
    @Param('board_name') board_name: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Content>> {
    const result = await this.content.findByBoardName(board_name, pageOptionsDto);
    return result;
  }

  // TODO Add Role Guard
  @ApiBearerAuth()
  @ApiBody({ type: CreateContentDto })
  @ApiParam({ name: 'board_name', required: true, description: 'Test Board' })
  @Post('/:board_name/content')
  @UseGuards(JwtAuthGuard)
  public async createContent(
    @Param('board_name') board_name: string,
    @Body() createContentData: CreateContentDto,
    @Ip() ip: string,
    @ReqUser() user: Payload,
  ): Promise<boolean> {
    const contentData: CreateContentDto = {
      ...createContentData,
      ip,
      author: user.username,
    };
    const user_id = user.user_id;
    const isSuccess = await this.content.create(user_id, board_name, contentData);
    return isSuccess;
  }

  // TODO Add Role Guard
  @ApiParam({ name: 'board_name', required: true, description: 'Test Board' })
  @ApiParam({ name: 'content_id', required: true, description: '1' })
  @Get('/:board_name/content/:content_id')
  public async findOneContent(
    @Param('board_name') board_name: string,
    @Param('content_id') content_id: number,
  ): Promise<Content> {
    const content = await this.content.findOneContent(board_name, content_id);
    return content;
  }
}

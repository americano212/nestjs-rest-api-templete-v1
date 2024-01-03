import { Body, Controller, Get, Ip, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ContentService } from '../providers';
import { CreateContentDto, PageDto, PageOptionsDto } from '../dto';
import { JwtAuthGuard, Payload } from 'src/auth';
import { ReqUser } from 'src/common';
import { Content } from '../board.interface';
import { GuardType } from '../enums';
import { BoardRole } from '../decorator';
import { BoardGuard } from '../guards';

@ApiBearerAuth()
@ApiTags('Content')
@UseGuards(BoardGuard)
@Controller('/board/:board_name/content')
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @ApiBody({ type: CreateContentDto })
  @ApiParam({ name: 'board_name', required: true, description: 'Admin Board' })
  @BoardRole(GuardType.WRITE)
  @Post()
  @UseGuards(JwtAuthGuard)
  public async createContent(
    @Param('board_name') boardName: string,
    @Body() createContentData: CreateContentDto,
    @Ip() ip: string,
    @ReqUser() user: Payload,
  ): Promise<boolean> {
    const contentData: CreateContentDto = {
      ...createContentData,
      ip,
      author: user.username,
    };
    const userId = user.user_id;
    const isSuccess = await this.content.create(userId, boardName, contentData);
    return isSuccess;
  }

  @ApiQuery({ name: 'page', required: false, description: '1' })
  @ApiQuery({ name: 'take', required: false, description: '10' })
  @ApiParam({ name: 'board_name', required: true, description: 'Admin Board' })
  @BoardRole(GuardType.READ)
  @Get('')
  public async findAllContents(
    @Param('board_name') boardName: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Content>> {
    const result = await this.content.findByBoardName(boardName, pageOptionsDto);
    return result;
  }

  @ApiParam({ name: 'board_name', required: true, description: 'Admin Board' })
  @ApiParam({ name: 'content_id', required: true, description: '1' })
  @BoardRole(GuardType.READ)
  @Get('/:content_id')
  public async findOneContent(
    @Param('board_name') boardName: string,
    @Param('content_id') contentId: number,
  ): Promise<Content> {
    const content = await this.content.findOneContent(boardName, contentId);
    return content;
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ContentService } from '../providers';
import { ContentDto, CreateContentDto, PageDto, PageOptionsDto, UpdateContentDto } from '../dto';
import { JwtAuthGuard, Payload } from 'src/auth';
import { ReqUser, Role, Roles } from 'src/common';
import { Content } from '../board.interface';
import { BoardGuardType, OwnerGuardType } from '../enums';
import { BoardRole, Owner } from '../decorator';
import { BoardGuard, OwnerGuard } from '../guards';

@ApiBearerAuth()
@ApiTags('Content')
@UseGuards(OwnerGuard)
@UseGuards(BoardGuard)
@Controller('/board/:board_name/content')
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @ApiBody({ type: CreateContentDto })
  @ApiParam({ name: 'board_name', required: true, description: 'Admin Board' })
  @BoardRole(BoardGuardType.WRITE)
  @Post()
  @UseGuards(JwtAuthGuard)
  public async create(
    @Param('board_name') boardName: string,
    @Body() createContentData: CreateContentDto,
    @Ip() ip: string,
    @ReqUser() user: Payload,
  ): Promise<boolean> {
    const contentData: ContentDto = {
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
  @BoardRole(BoardGuardType.READ)
  @Get()
  public async findAll(
    @Param('board_name') boardName: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Content>> {
    const result = await this.content.findAll(boardName, pageOptionsDto);
    return result;
  }

  @ApiParam({ name: 'board_name', required: true, description: 'Admin Board' })
  @ApiParam({ name: 'content_id', required: true, description: '1' })
  @BoardRole(BoardGuardType.READ)
  @Get('/:content_id')
  public async findOne(
    @Param('board_name') boardName: string,
    @Param('content_id') contentId: number,
  ): Promise<Content> {
    const content = await this.content.findOne(boardName, contentId);
    return content;
  }

  @ApiParam({ name: 'board_name', required: true, description: 'Admin Board' })
  @ApiParam({ name: 'content_id', required: true, description: '1' })
  @BoardRole(BoardGuardType.WRITE)
  @Owner(OwnerGuardType.CONTENT_OWNER)
  @Put('/:content_id')
  @UseGuards(JwtAuthGuard)
  public async update(
    @Param('board_name') boardName: string,
    @Param('content_id') contentId: number,
    @Body() updateContentData: UpdateContentDto,
    @Ip() ip: string,
  ): Promise<boolean> {
    const contentData: ContentDto = {
      ...updateContentData,
      ip,
    };
    const isSuccess = await this.content.update(boardName, contentId, contentData);
    return isSuccess;
  }

  @ApiParam({ name: 'board_name', required: true, description: 'Admin Board' })
  @ApiParam({ name: 'content_id', required: true, description: '1' })
  @BoardRole(BoardGuardType.WRITE)
  @Owner(OwnerGuardType.CONTENT_OWNER)
  @Delete('/:content_id')
  public async delete(
    @Param('board_name') boardName: string,
    @Param('content_id') contentId: number,
  ): Promise<boolean> {
    const isSuccess = await this.content.delete(boardName, contentId);
    return isSuccess;
  }

  @ApiParam({ name: 'board_name', required: true, description: 'Admin Board' })
  @ApiParam({ name: 'content_id', required: true, description: '1' })
  @Roles(Role.SuperAdmin)
  @Post('/restore/:content_id')
  public async restore(@Param('content_id') contentId: number) {
    const isSuccess = await this.content.restore(contentId);
    return isSuccess;
  }
}
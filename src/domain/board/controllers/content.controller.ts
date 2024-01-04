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
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ContentService } from '../providers';
import { ContentDto, CreateContentDto, PageDto, PageOptionsDto, UpdateContentDto } from '../dto';
import { JwtAuthGuard, Payload } from 'src/auth';
import { ReqUser, Role, Roles } from 'src/common';
import { Content } from '../board.interface';
import { BoardGuardType, OwnerGuardType } from '../enums';
import { BoardRole, Owner } from '../decorator';
import { BoardGuard, OwnerGuard } from '../guards';
import { SuccessResponseDto } from 'src/common/dto';

@ApiBearerAuth()
@ApiTags('Content')
@UseGuards(OwnerGuard)
@UseGuards(BoardGuard)
@Controller('/board/:board_name/content')
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @ApiParam({ name: 'board_name', required: true, description: 'Admin Board' })
  @BoardRole(BoardGuardType.WRITE)
  @UseGuards(JwtAuthGuard)
  @Post()
  public async create(
    @Param('board_name') boardName: string,
    @Body() createContentData: CreateContentDto,
    @Ip() ip: string,
    @ReqUser() user: Payload,
  ): Promise<SuccessResponseDto> {
    const contentData: ContentDto = { ...createContentData, ip, author: user.username };
    const userId = user.user_id;

    return { isSuccess: await this.content.create(userId, boardName, contentData) };
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
    return await this.content.findAll(boardName, pageOptionsDto);
  }

  @ApiParam({ name: 'board_name', required: true, description: 'Admin Board' })
  @ApiParam({ name: 'content_id', required: true, description: '1' })
  @BoardRole(BoardGuardType.READ)
  @Get('/:content_id')
  public async findOne(
    @Param('board_name') boardName: string,
    @Param('content_id') contentId: number,
  ): Promise<Content> {
    return await this.content.findOne(boardName, contentId);
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
  ): Promise<SuccessResponseDto> {
    const contentData: ContentDto = { ...updateContentData, ip };

    return { isSuccess: await this.content.update(boardName, contentId, contentData) };
  }

  @ApiParam({ name: 'board_name', required: true, description: 'Admin Board' })
  @ApiParam({ name: 'content_id', required: true, description: '1' })
  @BoardRole(BoardGuardType.WRITE)
  @Owner(OwnerGuardType.CONTENT_OWNER)
  @Delete('/:content_id')
  public async delete(
    @Param('board_name') boardName: string,
    @Param('content_id') contentId: number,
  ): Promise<SuccessResponseDto> {
    return { isSuccess: await this.content.delete(boardName, contentId) };
  }

  @ApiParam({ name: 'board_name', required: true, description: 'Admin Board' })
  @ApiParam({ name: 'content_id', required: true, description: '1' })
  @Roles(Role.SuperAdmin)
  @Post('/restore/:content_id')
  public async restore(@Param('content_id') contentId: number): Promise<SuccessResponseDto> {
    return { isSuccess: await this.content.restore(contentId) };
  }
}

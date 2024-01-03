import { Injectable, NotFoundException } from '@nestjs/common';

import { User as UserEntity } from '#entities/user.entity';
import { Content as ContentEntity } from '#entities/board';

import { ContentsRepository } from './content.repository';
import { BoardService } from './board.service';
import { CreateContentDto, UpdateContentDto } from '../dto';
import { PageDto, PageOptionsDto } from '../dto/pagination';
import { Content } from '../board.interface';

@Injectable()
export class ContentService {
  constructor(
    private readonly board: BoardService,
    private readonly contentsRepository: ContentsRepository,
  ) {}

  public async create(
    userId: number,
    boardName: string,
    contentData: CreateContentDto,
  ): Promise<boolean> {
    const board = await this.board.findByBoardName(boardName);
    const user = new UserEntity(userId);
    const result = await this.contentsRepository.create({ ...contentData, user, board });
    return result ? true : false;
  }

  public async findAll(
    boardName: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Content>> {
    const result = await this.contentsRepository.findAllByBoardName(boardName, pageOptionsDto);
    if (result.meta.last_page < result.meta.page) throw new NotFoundException(`Invalid page`);
    return result;
  }

  public async findOne(boardName: string, contentId: number): Promise<ContentEntity> {
    const content = await this.contentsRepository.findOne(boardName, contentId);
    if (!content) throw new NotFoundException(`Invalid content_id OR board_name`);
    return content;
  }

  public async update(
    boardName: string,
    contentId: number,
    contentData: UpdateContentDto,
  ): Promise<boolean> {
    const { user, board } = await this.findOne(boardName, contentId);
    const isSuccess = await this.contentsRepository.update(contentId, {
      ...contentData,
      user,
      board,
    });
    return isSuccess;
  }

  public async delete(boardName: string, contentId: number): Promise<boolean> {
    const {} = await this.findOne(boardName, contentId);
    const isSuccess = await this.contentsRepository.delete(contentId);
    return isSuccess;
  }

  public async restore(contentId: number): Promise<boolean> {
    const isSuccess = await this.contentsRepository.restore(contentId);
    return isSuccess;
  }
}

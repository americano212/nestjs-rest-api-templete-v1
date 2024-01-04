import { Injectable, NotFoundException } from '@nestjs/common';

import { User as UserEntity } from '#entities/user.entity';
import { Content } from '#entities/board';

import { ContentsRepository } from './content.repository';
import { BoardService } from './board.service';
import { ContentDto } from '../dto';
import { PageDto, PageOptionsDto } from '../dto/pagination';

@Injectable()
export class ContentService {
  constructor(
    private readonly board: BoardService,
    private readonly contentsRepository: ContentsRepository,
  ) {}

  public async create(
    userId: number,
    boardName: string,
    contentData: ContentDto,
  ): Promise<Content> {
    const board = await this.board.findByBoardName(boardName);
    const user = new UserEntity(userId);
    const content: ContentDto = { ...contentData, user, board };

    return await this.contentsRepository.create(content);
  }

  public async findAll(
    boardName: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Content>> {
    const content = await this.contentsRepository.findAllByBoardName(boardName, pageOptionsDto);
    if (content.meta.last_page < content.meta.page) throw new NotFoundException(`Invalid page`);
    return content;
  }

  public async findOne(boardName: string, contentId: number): Promise<Content> {
    const content = await this.contentsRepository.findOne(boardName, contentId);
    if (!content) throw new NotFoundException(`Invalid content_id OR board_name`);
    return content;
  }

  public async update(
    boardName: string,
    contentId: number,
    contentData: ContentDto,
  ): Promise<boolean> {
    const {} = await this.findOne(boardName, contentId);
    return await this.contentsRepository.update(contentId, contentData);
  }

  public async delete(boardName: string, contentId: number): Promise<boolean> {
    const {} = await this.findOne(boardName, contentId);
    return await this.contentsRepository.delete(contentId);
  }

  public async restore(contentId: number): Promise<boolean> {
    return await this.contentsRepository.restore(contentId);
  }
}

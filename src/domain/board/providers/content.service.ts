import { Injectable, NotFoundException } from '@nestjs/common';

import { User as UserEntity } from '#entities/user.entity';

import { ContentsRepository } from './content.repository';
import { BoardService } from './board.service';
import { CreateContentDto } from '../dto';
import { PageDto, PageOptionsDto } from '../dto/pagination';
import { Content } from '../board.interface';

@Injectable()
export class ContentService {
  constructor(
    private readonly board: BoardService,
    private readonly contentsRepository: ContentsRepository,
  ) {}

  public async create(
    user_id: number,
    board_name: string,
    contentData: CreateContentDto,
  ): Promise<boolean> {
    const board = await this.board.findByBoardName(board_name);
    const user = new UserEntity(); // TODO constructor
    user.user_id = user_id;
    const result = await this.contentsRepository.create({ ...contentData, user, board });
    return result ? true : false;
  }

  public async findByBoardName(
    board_name: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Content>> {
    const result = await this.contentsRepository.findByBoardName(board_name, pageOptionsDto);
    if (result.meta.last_page < result.meta.page) throw new NotFoundException(`Invalid page`);
    return result;
  }

  public async findOneContent(board_name: string, content_id: number): Promise<Content> {
    const content = await this.contentsRepository.findOne(board_name, content_id);
    if (!content) throw new NotFoundException(`Invalid content_id OR board_name`);
    return content;
  }
}

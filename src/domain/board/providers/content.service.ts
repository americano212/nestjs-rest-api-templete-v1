import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ContentsRepository } from './content.repository';
import { BoardService } from './board.service';

import { User as UserEntity } from '#entities/user.entity';
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
    try {
      const board = await this.board.findByBoardName(board_name);
      const user = new UserEntity();
      user.user_id = user_id;
      const result = await this.contentsRepository.create({ ...contentData, user, board });
      return result ? true : false;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        const message = error?.message;
        throw new HttpException(message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('UNKNOWN ERROR', HttpStatus.BAD_REQUEST);
    }
  }

  public async findByBoardName(
    board_name: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Content>> {
    try {
      const result = await this.contentsRepository.findByBoardName(board_name, pageOptionsDto);
      if (result.meta.last_page < result.meta.page)
        throw new NotFoundException(`The page ${result.meta.page} is not valid page`);
      return result;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        const message = error?.message;
        throw new HttpException(message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('UNKNOWN ERROR', HttpStatus.BAD_REQUEST);
    }
  }

  // TODO apply Exception
  public async findOneContent(board_name: string, content_id: number): Promise<Content> {
    const content = await this.contentsRepository.findOne(board_name, content_id);
    if (!content)
      throw new NotFoundException(
        `The content '${content_id}' invalid content OR The board '${board_name}' invalid board_name`,
      );
    return content;
  }
}

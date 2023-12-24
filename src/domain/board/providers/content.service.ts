import { Injectable } from '@nestjs/common';
import { ContentsRepository } from './content.repository';
import { BoardService } from './board.service';

import { User as UserEntity } from '#entities/user.entity';
import { CreateContentDto } from '../dto';
import { PageOptionsDto } from '../dto/pagination';

@Injectable()
export class ContentService {
  constructor(
    private readonly board: BoardService,
    private readonly contentsRepository: ContentsRepository,
  ) {}

  // TODO exception catch
  public async create(user_id: number, board_name: string, contentData: CreateContentDto) {
    const board = await this.board.findByBoardName(board_name);
    const user = new UserEntity();
    user.user_id = user_id;
    const result = await this.contentsRepository.create({
      ...contentData,
      user,
      board,
    });
    console.log(result);
    return true;
  }

  // TODO exception catch
  public async findByBoardName(board_name: string, pageOptionsDto: PageOptionsDto) {
    const result = await this.contentsRepository.findByBoardName(board_name, pageOptionsDto);
    if (result.pageMetaDto.last_page < result.pageMetaDto.page) throw Error();
    return result;
  }
}

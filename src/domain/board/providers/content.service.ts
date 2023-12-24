import { Injectable } from '@nestjs/common';
import { ContentsRepository } from './content.repository';
import { Content } from '../board.interface';

@Injectable()
export class ContentService {
  constructor(private readonly contentsRepository: ContentsRepository) {}

  public async create(board_name: string, contentData: Content) {
    console.log(board_name, contentData);
    return true;
  }

  public async findByBoardName(board_name: string, page: number) {
    const result = await this.contentsRepository.findByBoardName(board_name, page);
    if (result.meta.last_page < result.meta.page) throw Error();
    return result;
  }
}

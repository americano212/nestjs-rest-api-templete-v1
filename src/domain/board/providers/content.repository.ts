import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Content } from '#entities/board';
import { CreateContentDto } from '../dto';

@Injectable()
export class ContentsRepository {
  constructor(@InjectRepository(Content) private contentsRepository: Repository<Content>) {}

  public async create(contentData: CreateContentDto) {
    const result = await this.contentsRepository.save(contentData);
    return result;
  }

  public async findByBoardName(board_name: string, page: number) {
    const take = 1;
    const [contents, total] = await this.contentsRepository.findAndCount({
      take,
      skip: page <= 0 ? (page = 0) : (page - 1) * take,
      relations: { board: true },
      where: { board: { board_name: board_name } },
    });

    return {
      data: contents,
      meta: {
        total,
        page: page <= 0 ? (page = 1) : page,
        last_page: Math.ceil(total / take),
      },
    };
  }
}

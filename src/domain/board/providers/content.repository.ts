import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Content } from '#entities/board';
import { CreateContentDto } from '../dto';
import { PageMetaDto, PageOptionsDto } from '../dto/pagination';

@Injectable()
export class ContentsRepository {
  constructor(@InjectRepository(Content) private contentsRepository: Repository<Content>) {}

  public async create(contentData: CreateContentDto) {
    const result = await this.contentsRepository.save(contentData);
    return result;
  }

  public async findByBoardName(board_name: string, pageOptionsDto: PageOptionsDto) {
    const [contents, total] = await this.contentsRepository.findAndCount({
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
      relations: { board: true },
      where: { board: { board_name: board_name } },
    });
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, total });

    return { contents, pageMetaDto };
  }
}

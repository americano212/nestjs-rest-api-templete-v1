import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Content as ContentEntity } from '#entities/board';

import { CreateContentDto } from '../dto';
import { PageDto, PageMetaDto, PageOptionsDto } from '../dto/pagination';
import { Content } from '../board.interface';

@Injectable()
export class ContentsRepository {
  constructor(
    @InjectRepository(ContentEntity) private contentsRepository: Repository<ContentEntity>,
  ) {}

  public async create(contentData: CreateContentDto): Promise<ContentEntity | null> {
    const content = await this.contentsRepository.save(contentData);
    return content ? content : null;
  }

  public async findByBoardName(
    board_name: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Content>> {
    const [contents, total] = await this.contentsRepository.findAndCount({
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
      relations: { board: true },
      where: { board: { board_name: board_name } },
    });
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, total });

    return { data: contents, meta: pageMetaDto };
  }
}

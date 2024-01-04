import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Content as ContentEntity } from '#entities/board';

import { ContentDto } from '../dto';
import { PageDto, PageMetaDto, PageOptionsDto } from '../dto/pagination';
import { Content } from '../board.interface';

@Injectable()
export class ContentsRepository {
  constructor(
    @InjectRepository(ContentEntity) private contentsRepository: Repository<ContentEntity>,
  ) {}

  public async create(contentData: ContentDto): Promise<ContentEntity | null> {
    const content = await this.contentsRepository.save(contentData);
    return content ? content : null;
  }

  public async findAllByBoardName(
    boardName: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Content>> {
    const [contents, total] = await this.contentsRepository.findAndCount({
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
      relations: { board: true },
      where: { board: { board_name: boardName } },
    });
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, total });

    return { data: contents, meta: pageMetaDto };
  }

  public async findOne(boardName: string, contentId: number): Promise<ContentEntity | null> {
    const content = await this.contentsRepository.findOne({
      relations: { board: true, user: true },
      where: { board: { board_name: boardName }, content_id: contentId },
    });
    return content;
  }

  public async update(contentId: number, contentData: ContentDto): Promise<boolean> {
    const result = await this.contentsRepository.update({ content_id: contentId }, contentData);
    return result.affected ? true : false;
  }

  public async delete(contentId: number): Promise<boolean> {
    const result = await this.contentsRepository.softDelete({ content_id: contentId });
    return result.affected ? true : false;
  }

  public async restore(contentId: number): Promise<boolean> {
    const result = await this.contentsRepository.restore({ content_id: contentId });
    return result.affected ? true : false;
  }
}

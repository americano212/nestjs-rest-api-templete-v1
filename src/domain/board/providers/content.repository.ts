import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Content } from '#entities/board';

import { ContentDto } from '../dto';
import { PageDto, PageMetaDto, PageOptionsDto } from '../dto/pagination';
import { NullableType } from 'src/common/types';

@Injectable()
export class ContentsRepository {
  constructor(@InjectRepository(Content) private contentsRepository: Repository<Content>) {}

  public async create(contentData: ContentDto): Promise<Content> {
    return await this.contentsRepository.create(contentData);
  }

  public async findAllByBoardName(
    boardName: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Content>> {
    const [contents, total] = await this.contentsRepository.findAndCount({
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
      relations: { board: true },
      where: { board: { boardName: boardName } },
    });
    const pageMetaDto = new PageMetaDto({ pageOptionsDto, total });

    return { data: contents, meta: pageMetaDto };
  }

  public async findOne(boardName: string, contentId: number): Promise<NullableType<Content>> {
    return await this.contentsRepository.findOne({
      relations: { board: true, user: true },
      where: { board: { boardName: boardName }, contentId: contentId },
      select: { user: { userId: true }, board: { boardId: true } },
    });
  }

  public async update(contentId: number, contentData: ContentDto): Promise<boolean> {
    const result = await this.contentsRepository.update({ contentId: contentId }, contentData);
    return result.affected ? true : false;
  }

  public async delete(contentId: number): Promise<boolean> {
    const result = await this.contentsRepository.softDelete({ contentId: contentId });
    return result.affected ? true : false;
  }

  public async restore(contentId: number): Promise<boolean> {
    const result = await this.contentsRepository.restore({ contentId: contentId });
    return result.affected ? true : false;
  }
}

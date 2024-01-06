import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Board } from '#entities/board';

import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardDto } from '../dto';
import { NullableType } from 'src/common/types';

@Injectable()
export class BoardsRepository {
  constructor(@InjectRepository(Board) private boardsRepository: Repository<Board>) {}

  public async create(boardData: CreateBoardDto): Promise<Board> {
    return await this.boardsRepository.create(boardData);
  }

  public async findByBoardName(boardName: string): Promise<NullableType<Board>> {
    const board = await this.boardsRepository.findOneBy({ boardName: boardName });
    return board ? board : null;
  }

  public async update(boardId: number, boardData: UpdateBoardDto): Promise<boolean> {
    const result = await this.boardsRepository.update({ boardId: boardId }, boardData);
    return result.affected ? true : false;
  }

  public async delete(boardId: number): Promise<boolean> {
    const result = await this.boardsRepository.softDelete({ boardId: boardId });
    return result.affected ? true : false;
  }

  public async restore(boardId: number): Promise<boolean> {
    const result = await this.boardsRepository.restore({ boardId: boardId });
    return result.affected ? true : false;
  }
}

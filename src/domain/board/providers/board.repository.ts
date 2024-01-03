import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Board } from '#entities/board';

import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardDto } from '../dto';

@Injectable()
export class BoardsRepository {
  constructor(@InjectRepository(Board) private boardsRepository: Repository<Board>) {}

  public async create(boardData: CreateBoardDto): Promise<Board | null> {
    const board = await this.boardsRepository.save(boardData);
    return board ? board : null;
  }

  public async findByBoardName(boardName: string): Promise<Board | null> {
    const board = await this.boardsRepository.findOneBy({ board_name: boardName });
    return board ? board : null;
  }

  public async update(board_id: number, boardData: UpdateBoardDto): Promise<boolean> {
    const result = await this.boardsRepository.update({ board_id: board_id }, boardData);
    return result.affected ? true : false;
  }
}

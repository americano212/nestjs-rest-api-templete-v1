import { Board } from '#entities/board';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoardDto } from '../dto/create-board.dto';

@Injectable()
export class BoardsRepository {
  constructor(@InjectRepository(Board) private boardsRepository: Repository<Board>) {}

  public async create(createBoardData: CreateBoardDto): Promise<Board | null> {
    const board = await this.boardsRepository.save(createBoardData);
    return board ? board : null;
  }

  public async findByBoardName(board_name: string): Promise<Board | null> {
    const board = await this.boardsRepository.findOneBy({ board_name: board_name });
    if (!board) return null;
    return board;
  }
}

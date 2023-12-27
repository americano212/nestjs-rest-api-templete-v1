import { Injectable, NotFoundException } from '@nestjs/common';

import { Board } from '#entities/board';

import { CreateBoardDto } from '../dto/create-board.dto';
import { BoardsRepository } from './board.repository';

@Injectable()
export class BoardService {
  constructor(private readonly boardsRepository: BoardsRepository) {}

  public async create(createBoardData: CreateBoardDto): Promise<boolean> {
    const board = await this.boardsRepository.create(createBoardData);
    if (!board) throw Error();
    return true;
  }

  public async findByBoardName(board_name: string): Promise<Board> {
    const board = await this.boardsRepository.findByBoardName(board_name);
    if (!board) throw new NotFoundException(`The board name ${board_name} is not valid board`);
    return board;
  }
}

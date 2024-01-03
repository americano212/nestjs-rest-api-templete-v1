import { Injectable, NotFoundException } from '@nestjs/common';

import { Board } from '#entities/board';

import { CreateBoardDto } from '../dto/create-board.dto';
import { BoardsRepository } from './board.repository';
import { UpdateBoardDto } from '../dto';

@Injectable()
export class BoardService {
  constructor(private readonly boardsRepository: BoardsRepository) {}

  public async create(boardData: CreateBoardDto): Promise<boolean> {
    const board = await this.boardsRepository.create(boardData);
    return board ? true : false;
  }

  public async findByBoardName(board_name: string): Promise<Board> {
    const board = await this.boardsRepository.findByBoardName(board_name);
    if (!board) throw new NotFoundException(`The board name '${board_name}' invalid board`);
    return board;
  }

  public async update(boardData: UpdateBoardDto): Promise<boolean> {
    const { board_id } = await this.findByBoardName(boardData.board_name);
    const isSuccess = await this.boardsRepository.update(board_id, boardData);
    return isSuccess;
  }
}

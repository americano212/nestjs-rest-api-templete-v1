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

  public async findByBoardName(boardName: string): Promise<Board> {
    const board = await this.boardsRepository.findByBoardName(boardName);
    if (!board) throw new NotFoundException(`The board name '${boardName}' invalid board`);
    return board;
  }

  public async update(boardData: UpdateBoardDto): Promise<boolean> {
    const { board_id } = await this.findByBoardName(boardData.board_name);
    const isSuccess = await this.boardsRepository.update(board_id, boardData);
    return isSuccess;
  }

  public async delete(boardName: string): Promise<boolean> {
    const { board_id } = await this.findByBoardName(boardName);
    const isSuccess = await this.boardsRepository.delete(board_id);
    return isSuccess;
  }
}

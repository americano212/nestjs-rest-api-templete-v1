import { Injectable, NotFoundException } from '@nestjs/common';

import { Board } from '#entities/board';

import { CreateBoardDto } from '../dto/create-board.dto';
import { BoardsRepository } from './board.repository';
import { UpdateBoardDto } from '../dto';

@Injectable()
export class BoardService {
  constructor(private readonly boardsRepository: BoardsRepository) {}

  public async create(boardData: CreateBoardDto): Promise<Board> {
    return await this.boardsRepository.create(boardData);
  }

  public async findByBoardName(boardName: string): Promise<Board> {
    const board = await this.boardsRepository.findByBoardName(boardName);
    if (!board) throw new NotFoundException(`The board name '${boardName}' invalid board`);
    return board;
  }

  public async update(boardData: UpdateBoardDto): Promise<boolean> {
    const { boardId } = await this.findByBoardName(boardData.boardName);
    return await this.boardsRepository.update(boardId, boardData);
  }

  public async delete(boardName: string): Promise<boolean> {
    const { boardId } = await this.findByBoardName(boardName);
    return await this.boardsRepository.delete(boardId);
  }

  public async restore(boardId: number): Promise<boolean> {
    return await this.boardsRepository.restore(boardId);
  }
}

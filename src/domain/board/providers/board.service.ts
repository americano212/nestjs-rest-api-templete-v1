import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from '../dto/create-board.dto';
import { BoardsRepository } from './board.repository';
import { QueryFailedError } from 'typeorm';
import { MysqlErrorCode } from 'src/common';

@Injectable()
export class BoardService {
  constructor(private readonly boardsRepository: BoardsRepository) {}

  public async create(createBoardData: CreateBoardDto): Promise<boolean> {
    try {
      const board = await this.boardsRepository.create(createBoardData);
      if (!board) throw Error();
      return true;
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        if (error?.driverError.code === MysqlErrorCode.ALREADY_EXIST)
          throw new HttpException(
            `Board '${createBoardData.board_name}' already exists`,
            HttpStatus.BAD_REQUEST,
          );
      }
      throw new HttpException('UNKNOWN ERROR', HttpStatus.BAD_REQUEST);
    }
  }

  public async findByBoardName(board_name: string) {
    try {
      const board = await this.boardsRepository.findByBoardName(board_name);
      if (!board) throw new NotFoundException(`The role ${board_name} is not valid board`);
      return board;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        const message = error?.message;
        throw new HttpException(message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('UNKNOWN ERROR', HttpStatus.BAD_REQUEST);
    }
  }
}

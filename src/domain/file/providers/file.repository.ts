import { Injectable } from '@nestjs/common';
import { UploadFile } from '#entities/file';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadFileDto } from '../dto';

@Injectable()
export class FilesRepository {
  constructor(@InjectRepository(UploadFile) private filesRepository: Repository<UploadFile>) {}

  public async create(uploadFileData: UploadFileDto): Promise<UploadFile> {
    return await this.filesRepository.save(await this.filesRepository.create(uploadFileData));
  }
}

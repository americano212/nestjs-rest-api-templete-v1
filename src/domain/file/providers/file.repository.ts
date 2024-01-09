import { UploadFile } from '#entities/file';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FilesRepository {
  constructor(@InjectRepository(UploadFile) private filesRepository: Repository<UploadFile>) {}
}

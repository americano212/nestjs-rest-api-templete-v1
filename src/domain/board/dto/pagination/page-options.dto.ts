import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PageOptionsDto {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly take: number = 10;

  get skip(): number {
    return this.page <= 0 ? (this.page = 0) : (this.page - 1) * this.take;
  }
}

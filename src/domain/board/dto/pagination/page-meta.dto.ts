import { PageMetaDtoParameters } from './meta-dto-parameter.interface';

export class PageMetaDto {
  readonly total: number;
  readonly page: number;
  readonly take: number;
  readonly last_page: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, total }: PageMetaDtoParameters) {
    const { page, take } = pageOptionsDto;
    this.page = page <= 0 ? (this.page = 1) : page;
    this.take = take ? take : 10;
    this.total = total;
    this.last_page = Math.ceil(this.total / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.last_page;
  }
}

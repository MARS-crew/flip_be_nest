import { IPaginationMeta, IPaginationOptions } from 'nestjs-typeorm-paginate';

export class PagingGenerator {
  static generatePagingOptions(page = 1, limit = 10): IPaginationOptions {
    return { page, limit };
  }

  // static generatePagingInfo(pagingOptions: {
  //   limit: number;
  //   page: number;
  // }): IPaginationMeta {
  //   return {
  //     itemCount: pagingOptions.limit,
  //     totalItems: pagingOptions.limit,
  //     itemsPerPage: pagingOptions.limit,
  //     totalPages: pagingOptions.page,
  //     currentPage: pagingOptions.page,
  //   };
  // }

  static generatePagingInfo(
    pagingOptions: IPaginationOptions,
  ): IPaginationMeta {
    return {
      itemCount: parseInt(`${pagingOptions.limit}`),
      totalItems: parseInt(`${pagingOptions.limit}`),
      itemsPerPage: parseInt(`${pagingOptions.limit}`),
      totalPages: parseInt(`${pagingOptions.page}`),
      currentPage: parseInt(`${pagingOptions.page}`),
    };
  }
}

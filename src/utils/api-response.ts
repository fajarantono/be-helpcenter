import { CAMEL_CASE } from './transformers/camel-case.transfromer';

export class ApiResponse {
  static create(
    message: { code: number; message: string } | null = null,
    results: any = null,
    pagination: PaginationInfo | null = null,
  ): any {
    const res: any = {
      success: true,
      code: null,
      message,
      results: results !== null ? CAMEL_CASE(results) : [],
      pagination,
    };

    if (!message) {
      delete res.message;
      delete res.code;
    } else {
      res.code = message.code;
      res.message = message.message;

      if (!res.message) delete res.message;
    }

    if (!results) delete res.results;
    if (!pagination) delete res.pagination;

    return res;
  }
}

interface PaginationInfo {
  total: number;
  page: number;
  prev: number | null;
  next: number | null;
}

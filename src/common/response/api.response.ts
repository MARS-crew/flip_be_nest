import { HttpStatus } from '@nestjs/common';

export class ApiResponse<T> {
  private constructor(payload: {
    readonly data: T;
    readonly statusCode: number;
    readonly message: string;
  }) {
    this.data = payload.data;
    this.statusCode = payload.statusCode;
    this.message = payload.message;
  }
  private readonly data: T;
  private readonly statusCode: HttpStatus;
  private readonly message: string;

  static of<T>(payload: {
    readonly data?: T;
    readonly statusCode?: number;
    readonly message?: string;
  }): ApiResponse<T> {
    return new ApiResponse<T>({
      data: payload.data ?? null,
      statusCode: payload.statusCode ?? HttpStatus.OK,
      message: payload.message ?? '',
    });
  }
}

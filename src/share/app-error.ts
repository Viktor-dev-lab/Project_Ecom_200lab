import { Response } from "express";
import { ZodError } from "zod";

/**
 * Custom AppError class kế thừa từ Error
 * Mục đích:
 *  - Thêm statusCode (HTTP code)
 *  - Cho phép lưu rootCause (nguyên nhân gốc)
 *  - Cho phép lưu details (chi tiết lỗi dạng key-value)
 *  - Cho phép ghi logMessage (log nội bộ)
 *  - Cung cấp JSON response phù hợp với môi trường (prod/dev)
 */
export class AppError extends Error {
  private statusCode: number = 500;              // HTTP status code
  private rootCause?: Error;                     // Lỗi gốc (nếu có)
  private details: Record<string, any> = {};     // Chi tiết bổ sung cho lỗi
  private logMessage?: string;                   // Thông tin log nội bộ

  /**
   * Constructor private để ép dùng factory method AppError.from()
   * options (ES2022) có thể chứa "cause"
   */
  private constructor(err: Error, options?: ErrorOptions) {
    super(err.message, options);
  }

  /**
   * Factory Method (Design Pattern)
   * Tạo 1 AppError từ 1 Error bình thường
   */
  static from(err: Error, statusCode: number = 500) {
    const appError = new AppError(err);
    appError.statusCode = statusCode;
    return appError;
  }

  /**
   * Lấy rootCause sâu nhất (ví dụ lỗi gốc từ DB, Zod...)
   */
  getRootCause(): Error | null {
    if (this.rootCause) {
      return this.rootCause instanceof AppError
        ? this.rootCause.getRootCause()
        : this.rootCause;
    }
    return null;
  }

  /**
   * Wrapper (Design Pattern)
   * Tạo AppError mới bọc thêm rootCause
   */
  wrap(rootCause: Error): AppError {
    const appError = AppError.from(this, this.statusCode);
    appError.rootCause = rootCause;
    return appError;
  }

  /**
   * Setter chain: thêm detail cho error
   */
  withDetail(key: string, value: any): AppError {
    this.details[key] = value;
    return this;
  }

  /**
   * Setter chain: thêm log message cho error
   */
  withLog(logMessage: string): AppError {
    this.logMessage = logMessage;
    return this;
  }

  /**
   * Biến error thành JSON gửi ra client
   * - Prod: chỉ trả message, statusCode, details
   * - Dev: thêm rootCause, logMessage để debug
   */
  toJSON(isProduction: boolean = true) {
    const rootCause = this.getRootCause();

    return isProduction
      ? {
        message: this.message,
        statusCode: this.statusCode,
        details: this.details,
      }
      : {
        message: this.message,
        statusCode: this.statusCode,
        rootCause: rootCause ? rootCause.message : this.message,
        details: this.details,
        logMessage: this.logMessage,
      };
  }

  /**
   * Lấy statusCode để gửi response
   */
  getStatusCode(): number {
    return this.statusCode;
  }
}

/**
 * Middleware helper để xử lý lỗi chung
 * - Nếu là AppError: trả về JSON theo format
 * - Nếu là ZodError: wrap thành AppError với code 400
 * - Nếu là lỗi khác: wrap thành AppError 500
 */
export const responseErr = (err: Error, res: Response) => {
  const isProduction = process.env.NODE_ENV === "production";

  // In stacktrace ra console nếu đang ở dev
  !isProduction && console.error(err.stack);

  if (err instanceof AppError) {
    // Nếu đã là AppError thì trả về luôn
    res.status(err.getStatusCode()).json(err.toJSON(isProduction));
    return;
  }

  if (err instanceof ZodError) {
    // Nếu là ZodError (validate fail) thì wrap lại
    const appErr = ErrInvalidRequest.wrap(err);

    // Thêm chi tiết từng lỗi vào AppError
    err.issues.forEach((issue) => {
      appErr.withDetail(issue.path.join("."), issue.message);
    });

    // Trả rootCause là mảng issues thay vì chuỗi
    res.status(appErr.getStatusCode())
       .json({
        ...appErr.toJSON(isProduction), 
        rootCause: isProduction ? undefined : err.issues,
      });
    return;
  }


  // Lỗi còn lại thì coi như Internal Server Error
  const appErr = ErrInternalServer.wrap(err);
  res.status(appErr.getStatusCode()).json(appErr.toJSON(isProduction));
};

/**
 * Các lỗi mặc định (constant error object)
 */
export const ErrInternalServer = AppError.from(new Error("Something went wrong, please try again later."), 500);
export const ErrInvalidRequest = AppError.from(new Error("Invalid request"), 400);
export const ErrUnauthorized = AppError.from(new Error("Unauthorized"), 401);
export const ErrForbidden = AppError.from(new Error("Forbidden"), 403);
export const ErrNotFound = AppError.from(new Error("Not found"), 404);
export const ErrMethodNotAllowed = AppError.from(new Error("Method not allowed"), 405);

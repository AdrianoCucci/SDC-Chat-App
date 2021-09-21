import { HttpErrorResponse } from "@angular/common/http";

export const parseHttpError = (httpError: HttpErrorResponse): string | string[] => {
  let message: any = httpError.error.message;

  if(!message) {
    message = httpError.error.message;
  }

  return message;
}
import { HttpErrorResponse } from "@angular/common/http";

export const parseHttpError = (httpError: HttpErrorResponse, noArray: boolean = false): string | string[] => {
  let message: any = httpError.error.message;

  if(!message) {
    message = httpError.message;
  }
  else if(noArray && Array.isArray(message)) {
    message = "A server error has occurred";
  }

  return message;
}
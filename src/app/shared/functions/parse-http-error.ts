import { HttpErrorResponse } from '@angular/common/http';

export const parseErrorMessage = (
  error: any,
  fallbackMessage?: string
): string => {
  fallbackMessage = fallbackMessage ?? 'An unknown error has occurred';
  let message: string;

  try {
    if (error instanceof HttpErrorResponse) {
      message = error.error.message ?? error.message;
    } else if (error instanceof DOMException) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else {
      message = fallbackMessage;
    }
  } catch (error) {
    message = fallbackMessage;
  }

  return Array.isArray(message) ? message.join(',') : message;
};

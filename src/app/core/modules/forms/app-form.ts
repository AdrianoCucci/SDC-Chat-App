import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { defer, NEVER, Observable } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { parseErrorMessage } from 'src/app/shared/functions/parse-http-error';
import { FormMode } from 'src/app/shared/models/form-mode';
import { FormSubmitResult } from 'src/app/shared/modules/forms/form/form-submit-result';
import { Form } from 'src/app/shared/modules/forms/form/form.component';

@Component({ template: '' })
export abstract class AppForm<TModel = any, TResult = any> {
  @Output() public readonly onSubmitSuccess = new EventEmitter<TResult>();

  @Input() public model: TModel;
  @Input() public mode: FormMode = 'add';
  @Input() public dialog: boolean = false;
  @Input() public dialogVisible: boolean = false;

  @ViewChild(Form) private readonly _form: Form;

  private _isSubmitting: boolean;
  private _error: string;

  public submit(): void {
    this._form?.submit();
  }

  public clear(): void {
    this._form?.clearInputs();
    this._error = null;
  }

  onFormSubmit(result: FormSubmitResult): void {
    if (!result.isValid) {
      return;
    }

    this.sendSubmissionRequest(this.model).subscribe();
  }

  private sendSubmissionRequest(requestModel: TModel): Observable<void> {
    return defer<void>(() => {
      this._isSubmitting = true;
      this._error = null;

      return this.getRequestObservable(requestModel).pipe(
        first(),
        tap((result: TResult) => this.onSubmitSuccess.emit(result)),
        finalize(() => (this._isSubmitting = false)),
        catchError((error: any) => {
          this._error = parseErrorMessage(error);
          return NEVER;
        })
      );
    });
  }

  private getRequestObservable(model: TModel): Observable<TResult> {
    switch (this.mode) {
      case 'add':
        return this.onRequestAdd(model);
      case 'edit':
        return this.onRequestUpdate(model);
      default:
        throw new Error('Form [mode] property is not defined');
    }
  }

  protected abstract onRequestAdd(model: TModel): Observable<TResult>;

  protected abstract onRequestUpdate(model: TModel): Observable<TResult>;

  public get isSubmitting(): boolean {
    return this._isSubmitting;
  }

  public get error(): string {
    return this._error;
  }
}

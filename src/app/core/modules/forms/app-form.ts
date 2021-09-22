import { HttpErrorResponse } from "@angular/common/http";
import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { parseHttpError } from "src/app/shared/functions/parse-http-error";
import { FormMode } from "src/app/shared/models/form-mode";
import { FormSubmitResult } from "src/app/shared/modules/forms/form/form-submit-result";
import { Form } from "src/app/shared/modules/forms/form/form.component";

@Component({ template: '' })
export abstract class AppForm<TModel = any, TResult = any> {
  @Output() public readonly onSubmitSuccess = new EventEmitter<TResult>();

  @Input() public model: TModel;
  @Input() public mode: FormMode = "add";
  @Input() public dialog: boolean = false;
  @Input() public dialogVisible: boolean = false;

  @ViewChild(Form) private readonly _form: Form;

  private _isSubmitting: boolean;
  private _errors: string | string[];

  public submit(): void {
    this._form?.submit();
  }

  public clear(): void {
    this._form?.clearInputs();
    this._errors = null;
  }

  async onFormSubmit(result: FormSubmitResult): Promise<void> {
    if(result.isValid) {
      try {
        this._isSubmitting = true;
        this._errors = null;

        let resultModel: TResult;

        switch(this.mode) {
          case "add":
            resultModel = await this.onRequestAdd(this.model);
            break;
          case "edit":
            resultModel = await this.onRequestUpdate(this.model);
            break;
          default:
            throw new Error("Form [mode] property is not defined");
        }

        this.onSubmitSuccess.emit(resultModel);
      }
      catch(error) {
        this._errors = parseHttpError(error as HttpErrorResponse);
      }
      finally {
        this._isSubmitting = false;
      }
    }
  }

  protected abstract onRequestAdd(model: TModel): Promise<TResult>;

  protected abstract onRequestUpdate(model: TModel): Promise<TResult>;

  public get isSubmitting(): boolean {
    return this._isSubmitting;
  }

  public get errors(): string | string[] {
    return this._errors;
  }
}
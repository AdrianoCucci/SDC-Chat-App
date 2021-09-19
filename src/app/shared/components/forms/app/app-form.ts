import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { FormMode } from "src/app/shared/models/form-mode";
import { FormSubmitResult } from "../form/form-submit-result";
import { Form } from "../form/form.component";

@Component({ template: '' })
export abstract class AppForm<TModel = any, TResult = any> {
  @Output() public readonly onSubmitSuccess = new EventEmitter<TResult>();

  @Input() public model: TModel;
  @Input() public mode: FormMode = "add";
  @Input() public dialog: boolean = false;
  @Input() public dialogVisible: boolean = false;

  @ViewChild(Form) private readonly _form: Form;

  private _isSubmitting: boolean;

  public submit(): void {
    this._form?.submit();
  }

  public clear(): void {
    this._form?.clearInputs();
  }

  async onFormSubmit(result: FormSubmitResult): Promise<void> {
    if(result.isValid) {
      try {
        this._isSubmitting = true;

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
        console.error(error);
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
}
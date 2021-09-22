import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[app-template]'
})
export class TemplateDirective {
  @Input("app-template") public name: string;

  constructor(private _templateRef: TemplateRef<any>) { }

  public get template(): TemplateRef<any> {
    return this._templateRef;
  }
}

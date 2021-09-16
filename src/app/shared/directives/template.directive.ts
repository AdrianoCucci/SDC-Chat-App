import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appTemplate]'
})
export class TemplateDirective {
  @Input("appTemplate") public name: string;

  constructor(private _templateRef: TemplateRef<any>) { }

  public get template(): TemplateRef<any> {
    return this._templateRef;
  } 
}

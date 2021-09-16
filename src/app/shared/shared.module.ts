import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { TemplateDirective } from "./directives/template.directive";

const shared = [TemplateDirective];

@NgModule({
  imports: [CommonModule],
  exports: shared,
  declarations: shared
})
export class SharedModule { }
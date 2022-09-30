import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TemplateDirective } from './template.directive';

const directives = [TemplateDirective];

@NgModule({
  imports: [CommonModule],
  exports: directives,
  declarations: directives,
})
export class DirectivesModule {}

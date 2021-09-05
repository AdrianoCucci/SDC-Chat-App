import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinner } from './loading-spinner.component';

const component = [LoadingSpinner];

@NgModule({
  imports: [CommonModule],
  exports: component,
  declarations: component
})
export class LoadingSpinnerModule { }
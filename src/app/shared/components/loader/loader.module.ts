import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Loader } from './loader.component';

const component = [Loader];

@NgModule({
  imports: [CommonModule],
  exports: component,
  declarations: component
})
export class LoaderModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MenuButtonComponent } from './menu-button.component';
const component = [MenuButtonComponent];

@NgModule({
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  exports: component,
  declarations: component,
})
export class MenuButtonModule {}

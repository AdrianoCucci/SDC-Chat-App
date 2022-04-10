import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountPageRoutingModule } from './account-page-routing.module';

import { TabMenuPanelModule } from 'src/app/shared/modules/menus/tab-menu-panel/tab-menu-panel.module';
import { ButtonModule } from 'src/app/shared/modules/button/button.module';
import { InputToggleModule } from 'src/app/shared/modules/forms/inputs/input-toggle/input-toggle.module';
import { InlineAlertModule } from 'src/app/shared/modules/inline-alert/inline-alert.module';
import { AccountFormModule } from 'src/app/core/modules/forms/account-form/account-form.module';
import { PassChangeFormModule } from 'src/app/core/modules/forms/pass-change-form/pass-change-form.module';
import { OrganizationFormModule } from 'src/app/core/modules/forms/organization-form/organization-form.module';
import { AccessibilityDialogModule } from 'src/app/shared/modules/accessibility/accessibility-dialog/accessibility.dialog.module';

import { AccountPage } from './account-page.component';

@NgModule({
  declarations: [AccountPage],
  imports: [
    CommonModule,
    AccountPageRoutingModule,
    TabMenuPanelModule,
    ButtonModule,
    InputToggleModule,
    InlineAlertModule,
    AccountFormModule,
    PassChangeFormModule,
    OrganizationFormModule,
    AccessibilityDialogModule
  ]
})
export class AccountPageModule { }
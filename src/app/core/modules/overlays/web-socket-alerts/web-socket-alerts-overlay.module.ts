import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebSocketAlertsOverlay } from './web-socket-alerts.overlay';
import { ToastOverlayModule } from 'src/app/shared/modules/overlays/toast/toast-overlay.module';

@NgModule({
  declarations: [WebSocketAlertsOverlay],
  imports: [
    CommonModule,
    ToastOverlayModule
  ],
  exports: [WebSocketAlertsOverlay]
})
export class WebSocketAlertsOverlayModule { }
import { A11yModule } from '@angular/cdk/a11y';
import { DialogModule as CdkDialogModule } from '@angular/cdk/dialog';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DialogService } from './dialog.service';

@NgModule({
  imports: [CommonModule, PortalModule, CdkDialogModule, A11yModule],
  providers: [DialogService],
})
export class DialogModule {}

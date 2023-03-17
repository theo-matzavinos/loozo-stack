export * from './lib/dialog.module';
export * from './lib/dialog.component';
export * from './lib/dialog-body.directive';
export * from './lib/dialog-footer.directive';
export * from './lib/dialog-header.directive';
export * from './lib/dialog.service';

import { DialogComponent } from './lib/dialog.component';
import { DialogBodyDirective } from './lib/dialog-body.directive';
import { DialogFooterDirective } from './lib/dialog-footer.directive';
import { DialogHeaderDirective } from './lib/dialog-header.directive';

export const DIALOG_COMPONENT_PARTS = [
  DialogComponent,
  DialogBodyDirective,
  DialogFooterDirective,
  DialogHeaderDirective,
];

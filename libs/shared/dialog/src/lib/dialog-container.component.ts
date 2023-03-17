import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CdkDialogContainer } from '@angular/cdk/dialog';
import { PortalModule } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'loozo-stack-dialog-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [PortalModule],
  animations: [
    trigger('dialog', [
      state('void, exit', style({ opacity: 0, transform: 'scale(0.3)' })),
      state('enter', style({ transform: 'none' })),
      transition(
        '* => enter',
        animate(
          '150ms cubic-bezier(0, 0, 0.2, 1)',
          style({ transform: 'none', opacity: 1 }),
        ),
      ),
      transition(
        '* => void, * => exit',
        animate('75ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 0 })),
      ),
    ]),
  ],
  host: {
    class: 'flex flex-col flex-grow overflow-hidden focus:outline-none',
  },
  template: `<ng-template cdkPortalOutlet />`,
})
export class DialogContainerComponent extends CdkDialogContainer {}

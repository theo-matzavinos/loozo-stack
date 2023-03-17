import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { GlobalPositionStrategy } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { take } from 'rxjs';

import { DialogContainerComponent } from './dialog-container.component';

@Injectable()
export class DialogService {
  private dialog = inject(Dialog);

  open<Result, Data = unknown, Component = unknown>(
    component: ComponentType<Component>,
    config?: DialogConfig<Data, DialogRef<Result, Component>>,
  ): DialogRef<Result, Component> {
    const topDisplacement = this.dialog.openDialogs.length
      ? `${this.dialog.openDialogs.length * 6}rem`
      : '';

    this.dialog.openDialogs.forEach((dialog) =>
      dialog.overlayRef.addPanelClass('collapsed'),
    );

    const dialogRef = this.dialog.open<Result, Data, Component>(component, {
      positionStrategy: new GlobalPositionStrategy()
        .centerHorizontally()
        .centerVertically()
        .top(topDisplacement),
      maxHeight: `calc(100% - ${topDisplacement || 0})`,
      container: DialogContainerComponent,
      ...config,
      panelClass: [
        'self-start',
        'flex-grow',
        'mx-12',
        'lg:pt-16',
        'lg:pb-8',
        'lg:mx-48',
        'xl:mx-92',
        ...(config?.panelClass || []),
      ],
    });

    dialogRef.closed.pipe(take(1)).subscribe(() => {
      const previousDialog =
        this.dialog.openDialogs[this.dialog.openDialogs.length - 1];

      if (!previousDialog) {
        return;
      }

      previousDialog.overlayRef.removePanelClass('collapsed');
    });

    return dialogRef;
  }
}

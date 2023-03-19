import { DialogRef } from '@angular/cdk/dialog';
import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  TemplateRef,
} from '@angular/core';
import { Observable, take } from 'rxjs';

import { DialogBodyDirective } from './dialog-body.directive';
import { DialogFooterDirective } from './dialog-footer.directive';
import { DialogHeaderDirective } from './dialog-header.directive';

export type DialogKind = 'default' | 'error' | 'warning' | 'success' | 'info';

@Component({
  selector: 'loozo-stack-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, NgIf, NgTemplateOutlet],
  styles: [
    `
      :host-context(.collapsed) main,
      :host-context(.collapsed) footer {
        display: none;
      }
    `,
  ],
  host: {
    class: 'flex flex-col rounded-lg shadow bg-white overflow-hidden',
  },
  template: `
    <header class="rounded-top text-2xl">
      <div class="m-2 flex rounded-lg py-4 pl-8 pr-4" [ngClass]="headerClasses">
        <div class="flex flex-grow pr-8">
          <ng-container *ngTemplateOutlet="headerTemplateRef"></ng-container>
        </div>
        <button
          *ngIf="canClose"
          type="button"
          class="btn btn-flat btn-gray ml-12 flex items-center self-center border-0 p-2"
          (click)="onClose()"
          consalioTooltip="Close"
        >
          <!-- <consalio-icon
        class="h-4 w-4 stroke-current"
        name="close"
      ></consalio-icon> -->
        </button>
      </div>
    </header>
    <main class="flex flex-grow flex-col overflow-y-auto px-8 py-4">
      <ng-container *ngTemplateOutlet="bodyTemplateRef"></ng-container>
    </main>
    <footer class="flex items-center justify-end py-4 pl-8 pr-4">
      <ng-container *ngTemplateOutlet="footerTemplateRef"></ng-container>
    </footer>
  `,
})
export class DialogComponent<T = unknown> {
  @ContentChild(DialogHeaderDirective, { static: true, read: TemplateRef })
  headerTemplateRef!: TemplateRef<unknown>;
  @ContentChild(DialogBodyDirective, { static: true, read: TemplateRef })
  bodyTemplateRef!: TemplateRef<unknown>;
  @ContentChild(DialogFooterDirective, { static: true, read: TemplateRef })
  footerTemplateRef!: TemplateRef<unknown>;

  @Input() kind: DialogKind = 'default';
  @Input() cancelClose?: (dialogResult?: T) => Observable<boolean>;

  get headerClasses() {
    return this.headerClassesByKind[this.kind];
  }

  get canClose() {
    return !this.dialogRef.disableClose;
  }

  private headerClassesByKind: Record<DialogKind, string> = {
    default: 'bg-gray-300',
    error: 'bg-red-400',
    info: 'bg-teal-500',
    success: 'bg-green-400',
    warning: 'bg-amber-400',
  };

  constructor(private dialogRef: DialogRef<T>) {
    const originalClose = this.dialogRef.close.bind(this.dialogRef);

    this.dialogRef.close = (dialogResult?: T) => {
      if (!this.cancelClose) {
        originalClose(dialogResult);

        return;
      }

      this.cancelClose(dialogResult)
        .pipe(take(1))
        .subscribe((closeCanceled) => {
          if (!closeCanceled) {
            originalClose(dialogResult);
          }

          return;
        });
    };
  }

  onClose() {
    this.dialogRef.close();
  }
}

import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[loozoStackDialogFooter]',
  standalone: true,
})
export class DialogFooterDirective {
  constructor(readonly templateRef: TemplateRef<unknown>) {}
}

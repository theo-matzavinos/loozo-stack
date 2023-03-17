import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[loozoStackDialogHeader]',
  standalone: true,
})
export class DialogHeaderDirective {
  constructor(readonly templateRef: TemplateRef<unknown>) {}
}

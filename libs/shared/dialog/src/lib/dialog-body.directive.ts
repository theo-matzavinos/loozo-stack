import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[loozoStackDialogBody]',
  standalone: true,
})
export class DialogBodyDirective {
  constructor(readonly templateRef: TemplateRef<unknown>) {}
}

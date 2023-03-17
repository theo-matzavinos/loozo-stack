import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UseMutation, QueryClientService } from '@ngneat/query';
import { from } from 'rxjs';
import { TRPC_SERVICE } from '../trpc.service';
import { inferRouterInputs } from '@trpc/server';
import { AppRouter } from '../../server';
import { ButtonDirective } from '@loozo-stack/shared/button';
import { DIALOG_COMPONENT_PARTS } from '@loozo-stack/shared/dialog';
import { DialogRef } from '@angular/cdk/dialog';

type AddToDoInput = inferRouterInputs<AppRouter>['addTodo'];

@Component({
  selector: 'loozo-stack-new-todo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonDirective,
    DIALOG_COMPONENT_PARTS,
  ],
  template: `
    <loozo-stack-dialog>
      <ng-container *loozoStackDialogHeader>New ToDo</ng-container>
      <form
        *loozoStackDialogBody
        id="newToDoForm"
        class="flex flex-grow flex-col gap-y-4"
        [formGroup]="newToDoForm"
        (ngSubmit)="onSubmit()"
      >
        <label>
          <div class="w-32">Title:</div>
          <input type="text" class="w-full" formControlName="title" />
        </label>
        <label>
          <div class="w-32">Description:</div>
          <textarea class="w-full" formControlName="description"></textarea>
        </label>
      </form>
      <ng-container *loozoStackDialogFooter>
        <button form="newToDoForm">Add</button>
      </ng-container>
    </loozo-stack-dialog>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTodoComponent {
  newToDoForm = inject(FormBuilder).group({
    title: ['', Validators.required],
    description: [''],
  });

  private addToDoMutation = injectAddToDosMutation();
  private dialogRef = inject(DialogRef);

  async onSubmit() {
    if (this.newToDoForm.invalid) {
      return;
    }

    await this.addToDoMutation.mutate(this.newToDoForm.value as AddToDoInput);
    this.dialogRef.close();
  }
}

function injectAddToDosMutation() {
  const useMutation = inject(UseMutation);
  const queryClientService = inject(QueryClientService);
  const trpcService = inject(TRPC_SERVICE);

  return useMutation(
    (toDoToCreate: AddToDoInput) => {
      return from(trpcService.addTodo.mutate(toDoToCreate));
    },
    {
      onSuccess: (data) => {
        // queryClientService.invalidateQueries(['todos']);
        const currentToDos = (queryClientService.getQueryData(['todos']) ??
          []) as string[];

        queryClientService.setQueryData(['todos'], [...currentToDos, data]);
      },
    },
  );
}

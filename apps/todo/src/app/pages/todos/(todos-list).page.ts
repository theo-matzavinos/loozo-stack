import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { QueryClientService, UseMutation, UseQuery } from '@ngneat/query';
import { from } from 'rxjs';
import { LetModule } from '@rx-angular/template/let';
import { ForModule } from '@rx-angular/template/for';
import { Dialog, DialogModule } from '@angular/cdk/dialog';

import { TRPC_SERVICE } from '../../trpc.service';
import { NgIf } from '@angular/common';
import { NewTodoComponent } from '../../components/new-todo.component';
import { ButtonDirective } from '../../directives/button.directive';
import { ToDo } from '@prisma/client';

@Component({
  selector: 'loozo-stack-todos-list',
  standalone: true,
  imports: [ForModule, LetModule, NgIf, DialogModule, ButtonDirective],
  template: `
    <button type="button" variant="raised" color="primary" (click)="onAdd()">
      Add
    </button>
    <ng-container *rxLet="todosQuery.result$ as todosQueryResult">
      <div *ngIf="todosQueryResult.isSuccess" class="flex flex-col gap-y-2">
        <div
          *rxFor="let todo of todosQueryResult.data"
          class="flex items-center gap-x-4"
        >
          {{ todo.title }}
          <button
            type="button"
            class="ml-auto"
            size="icon"
            variant="stroked"
            (click)="onDelete(todo)"
          >
            <div class="flex h-4 w-4 items-center justify-center">x</div>
          </button>
        </div>
      </div>
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TodosListComponent {
  todosQuery = injectToDosQuery();

  private dialog = inject(Dialog);
  private deleteToDoMutation = injectDeleteToDoMutation();

  onAdd() {
    this.dialog.open(NewTodoComponent);
  }

  onDelete(toDo: ToDo) {
    this.deleteToDoMutation.mutate(toDo.id);
  }
}

function injectToDosQuery() {
  const trpcService = inject(TRPC_SERVICE);
  const useQuery = inject(UseQuery);

  return useQuery(['todos'], () => from(trpcService.getTodos.query()));
}

function injectDeleteToDoMutation() {
  const useMutation = inject(UseMutation);
  const queryClientService = inject(QueryClientService);
  const trpcService = inject(TRPC_SERVICE);

  return useMutation(
    (toDoId: string) => {
      return from(trpcService.deleteTodo.mutate(toDoId));
    },
    {
      onSuccess: (_, toDoId) => {
        // queryClientService.invalidateQueries(['todos']);
        const currentToDos = (queryClientService.getQueryData(['todos']) ??
          []) as ToDo[];

        queryClientService.setQueryData(
          ['todos'],
          currentToDos.filter((todo) => todo.id !== toDoId),
        );
      },
    },
  );
}

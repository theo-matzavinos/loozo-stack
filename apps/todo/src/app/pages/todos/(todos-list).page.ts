import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryClientService, UseMutation, UseQuery } from '@ngneat/query';
import { LetModule } from '@ngrx/component';
import { from } from 'rxjs';

import { TRPC_SERVICE } from '../../trpc.service';

@Component({
  selector: 'loozo-stack-todos-list',
  standalone: true,
  imports: [CommonModule, LetModule],
  template: `<button type="button" (click)="onAdd()">Add</button>
    <ng-container *ngrxLet="todosQuery.result$ as todosQueryResult">
      <ng-container *ngIf="todosQueryResult.isSuccess">
        <div *ngFor="let todo of todosQueryResult.data">
          {{ todo.title }}
        </div>
      </ng-container>
    </ng-container>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TodosListComponent {
  todosQuery = injectToDosQuery();

  private readonly addToDoMutation = injectAddToDosMutation();

  onAdd() {
    this.addToDoMutation.mutate();
  }
}

function injectToDosQuery() {
  const trpcService = inject(TRPC_SERVICE);
  const useQuery = inject(UseQuery);

  return useQuery(['todos'], () => from(trpcService.getTodos.query()));
}

function injectAddToDosMutation() {
  const useMutation = inject(UseMutation);
  const queryClientService = inject(QueryClientService);
  const trpcService = inject(TRPC_SERVICE);

  return useMutation(
    () => {
      return from(
        trpcService.addTodo.mutate({
          title: `test ${Date.now()}`,
          description: 'huh',
        }),
      );
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

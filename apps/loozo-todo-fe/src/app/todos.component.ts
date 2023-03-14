import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryClientService, UseMutation, UseQuery } from '@ngneat/query';
import { LetModule } from '@ngrx/component';
import { TRPC_SERVICE } from './trpc.service';
import { from } from 'rxjs';

@Component({
  selector: 'loozo-stack-todos',
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
export default class TodosComponent {
  private readonly trpcService = inject(TRPC_SERVICE);
  private readonly useQuery = inject(UseQuery);
  private readonly useMutation = inject(UseMutation);
  private readonly queryClientService = inject(QueryClientService);
  private readonly addToDoMutation = this.useMutation(
    () => {
      return from(
        this.trpcService.addTodo.mutate({
          title: `test ${Date.now()}`,
          description: 'huh',
        }),
      );
    },
    {
      onSuccess: (data) => {
        // this.queryClientService.invalidateQueries(['todos']);
        const currentToDos = (this.queryClientService.getQueryData(['todos']) ??
          []) satisfies string[];

        this.queryClientService.setQueryData(
          ['todos'],
          [...currentToDos, data],
        );
      },
    },
  );

  todosQuery = this.useQuery(['todos'], () =>
    from(this.trpcService.getTodos.query()),
  );

  onAdd() {
    this.addToDoMutation.mutate();
  }
}

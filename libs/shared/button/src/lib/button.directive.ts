import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  Input,
} from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  Observable,
  pairwise,
  pipe,
  startWith,
  tap,
  UnaryFunction,
} from 'rxjs';
import { ValueOf } from 'type-fest';

export const BUTTON_SIZE = {
  ICON: 'icon',
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg',
} as const;

export type ButtonSize = ValueOf<typeof BUTTON_SIZE>;

const SIZE_CLASSES = {
  [BUTTON_SIZE.ICON]: [
    'flex',
    'items-center',
    'justify-center',
    'p-1',
    'rounded-full',
  ],
  [BUTTON_SIZE.SMALL]: ['py-0', 'px-2', 'rounded-lg'],
  [BUTTON_SIZE.MEDIUM]: ['py-1', 'px-4', 'rounded-lg'],
  [BUTTON_SIZE.LARGE]: ['py-2', 'px-6', 'rounded-lg'],
};

export const BUTTON_VARIANT = {
  FLAT: 'flat',
  RAISED: 'raised',
  STROKED: 'stroked',
  LINK: 'link',
} as const;

export type ButtonVariant = ValueOf<typeof BUTTON_VARIANT>;

const VARIANT_CLASSES = {
  [BUTTON_VARIANT.LINK]: ['bg-transparent', 'border-0', 'underline'],
  [BUTTON_VARIANT.RAISED]: ['shadow', 'border-0'],
  [BUTTON_VARIANT.STROKED]: [
    'bg-transparent',
    'bg-white',
    'border',
    'border-gray-500',
  ],
  [BUTTON_VARIANT.FLAT]: ['border-0'],
};

export const BUTTON_COLOR = {
  BASIC: 'basic',
  PRIMARY: 'primary',
  ACCENT: 'accent',
  WARNING: 'warning',
} as const;

export type ButtonColor = ValueOf<typeof BUTTON_COLOR>;

const COLOR_CLASSES = {
  [BUTTON_COLOR.ACCENT]: ['hover:bg-violet-200', 'ring-violet-700'],
  [BUTTON_COLOR.BASIC]: ['hover:bg-gray-200', 'ring-gray-700'],
  [BUTTON_COLOR.PRIMARY]: ['hover:bg-slate-200', 'ring-slate-700'],
  [BUTTON_COLOR.WARNING]: ['hover:bg-amber-200', 'ring-amber-700'],
};

const COLOR_VARIANT_CLASSES = {
  [BUTTON_COLOR.ACCENT]: {
    [BUTTON_VARIANT.LINK]: ['text-violet-500'],
    [BUTTON_VARIANT.FLAT]: ['bg-violet-500', 'text-white', 'hover:text-black'],
    [BUTTON_VARIANT.RAISED]: [
      'bg-violet-500',
      'text-white',
      'hover:text-black',
    ],
    [BUTTON_VARIANT.STROKED]: ['text-violet-500'],
  },
  [BUTTON_COLOR.BASIC]: {
    [BUTTON_VARIANT.LINK]: [],
    [BUTTON_VARIANT.FLAT]: ['bg-gray-100'],
    [BUTTON_VARIANT.RAISED]: ['bg-gray-100'],
    [BUTTON_VARIANT.STROKED]: [],
  },
  [BUTTON_COLOR.PRIMARY]: {
    [BUTTON_VARIANT.LINK]: ['text-slate-500'],
    [BUTTON_VARIANT.FLAT]: ['bg-slate-500', 'text-white', 'hover:text-black'],
    [BUTTON_VARIANT.RAISED]: ['bg-slate-500', 'text-white', 'hover:text-black'],
    [BUTTON_VARIANT.STROKED]: ['text-slate-500'],
  },
  [BUTTON_COLOR.WARNING]: {
    [BUTTON_VARIANT.LINK]: ['text-amber-500'],
    [BUTTON_VARIANT.FLAT]: ['bg-amber-500'],
    [BUTTON_VARIANT.RAISED]: ['bg-amber-500'],
    [BUTTON_VARIANT.STROKED]: ['text-amber-500'],
  },
};

@Directive({
  selector: 'button',
  standalone: true,
  host: {
    class:
      'outline-none ring-inset transition duration-75 ease-linear focus:ring active:ring',
  },
})
export class ButtonDirective implements AfterViewInit {
  @Input()
  set size(size: ButtonSize) {
    this.store.patchState({ size });
  }

  @Input()
  set variant(variant: ButtonVariant) {
    this.store.patchState({ variant });
  }

  @Input()
  set color(color: ButtonColor) {
    this.store.patchState({ color });
  }

  private elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private store = new ComponentStore<
    Pick<ButtonDirective, 'color' | 'size' | 'variant'>
  >({
    size: BUTTON_SIZE.MEDIUM,
    color: BUTTON_COLOR.BASIC,
    variant: BUTTON_VARIANT.FLAT,
  });
  private sizeEffect = createButtonPropEffect<ButtonSize>({
    store: this.store,
    classesRecord: SIZE_CLASSES,
    elementRef: this.elementRef,
  });
  private variantEffect = createButtonPropEffect<ButtonVariant>({
    store: this.store,
    classesRecord: VARIANT_CLASSES,
    elementRef: this.elementRef,
  });
  private colorEffect = createButtonPropEffect<ButtonColor>({
    store: this.store,
    classesRecord: COLOR_CLASSES,
    elementRef: this.elementRef,
  });
  private variantAndColorEffect = this.store.effect<{
    variant: ButtonVariant;
    color: ButtonColor;
  }>(
    pipe(
      pairwiseWithUndefinedInitialValue(),
      tap(([previous, next]) => {
        if (previous) {
          const previousClasses =
            COLOR_VARIANT_CLASSES[previous.color][previous.variant];

          for (const previousClass of previousClasses) {
            this.elementRef.nativeElement.classList.remove(previousClass);
          }
        }

        const nextClasses = COLOR_VARIANT_CLASSES[next.color][next.variant];

        for (const nextClass of nextClasses) {
          this.elementRef.nativeElement.classList.add(nextClass);
        }
      }),
    ),
  );
  private size$ = this.store.select((state) => state.size, { debounce: true });
  private variant$ = this.store.select((state) => state.variant, {
    debounce: true,
  });
  private color$ = this.store.select((state) => state.color, {
    debounce: true,
  });
  private variantAndColor$ = this.store.select(
    { color: this.color$, variant: this.variant$ },
    { debounce: true },
  );

  ngAfterViewInit() {
    this.sizeEffect(this.size$);
    this.variantEffect(this.variant$);
    this.colorEffect(this.color$);
    this.variantAndColorEffect(this.variantAndColor$);
  }
}

function pairwiseWithUndefinedInitialValue<T>() {
  return pipe(startWith(undefined), pairwise()) as UnaryFunction<
    Observable<T>,
    Observable<[T | undefined, T]>
  >;
}

function createButtonPropEffect<
  T extends ButtonSize | ButtonVariant | ButtonColor,
>({
  store,
  classesRecord,
  elementRef,
}: {
  store: ComponentStore<Pick<ButtonDirective, 'color' | 'size' | 'variant'>>;
  classesRecord: Record<T, string[]>;
  elementRef: ElementRef<HTMLElement>;
}) {
  return store.effect<T>(
    pipe(
      pairwiseWithUndefinedInitialValue(),
      tap(([previous, next]) => {
        if (previous) {
          const previousClasses = classesRecord[previous];

          for (const previousClass of previousClasses) {
            elementRef.nativeElement.classList.remove(previousClass);
          }
        }

        const nextClasses = classesRecord[next];

        for (const nextClass of nextClasses) {
          elementRef.nativeElement.classList.add(nextClass);
        }
      }),
    ),
  );
}

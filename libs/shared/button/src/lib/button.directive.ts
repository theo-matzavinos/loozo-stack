import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  Input,
  signal,
  effect,
  Signal,
  computed,
} from '@angular/core';
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
    this.size$.set(size);
  }

  @Input()
  set variant(variant: ButtonVariant) {
    this.variant$.set(variant);
  }

  @Input()
  set color(color: ButtonColor) {
    this.color$.set(color);
  }

  private elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private size$ = signal<ButtonSize>(BUTTON_SIZE.MEDIUM);
  private variant$ = signal<ButtonVariant>(BUTTON_VARIANT.FLAT);
  private color$ = signal<ButtonColor>(BUTTON_COLOR.BASIC);

  ngAfterViewInit() {
    createButtonPropEffect({
      signal$: this.size$,
      getClasses: (size) => SIZE_CLASSES[size],
      elementRef: this.elementRef,
    });
    createButtonPropEffect({
      signal$: this.variant$,
      getClasses: (variant) => VARIANT_CLASSES[variant],
      elementRef: this.elementRef,
    });
    createButtonPropEffect({
      signal$: this.color$,
      getClasses: (color) => COLOR_CLASSES[color],
      elementRef: this.elementRef,
    });
    createButtonPropEffect({
      signal$: computed(() => ({
        variant: this.variant$(),
        color: this.color$(),
      })),
      getClasses: ({ color, variant }) => COLOR_VARIANT_CLASSES[color][variant],
      elementRef: this.elementRef,
    });
  }
}

function createButtonPropEffect<T>({
  signal$,
  getClasses,
  elementRef,
}: {
  signal$: Signal<T>;
  getClasses: (value: T) => string[];
  elementRef: ElementRef<HTMLElement>;
}) {
  let previousValue: T | undefined;

  effect(() => {
    if (previousValue) {
      const previousClasses = getClasses(previousValue);

      for (const previousClass of previousClasses) {
        elementRef.nativeElement.classList.remove(previousClass);
      }
    }

    previousValue = signal$();

    const nextClasses = getClasses(signal$());

    for (const nextClass of nextClasses) {
      elementRef.nativeElement.classList.add(nextClass);
    }
  });
}

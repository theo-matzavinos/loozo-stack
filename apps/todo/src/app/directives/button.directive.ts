import {
  Directive,
  ElementRef,
  HostBinding,
  inject,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';

export const BUTTON_SIZE = {
  ICON: 'icon',
  SMALL: 'sm',
  MEDIUM: 'md',
  LARGE: 'lg',
} as const;

export type ButtonSize = EnumType<typeof BUTTON_SIZE>;

const SIZE_CLASSES = {
  [BUTTON_SIZE.ICON]: ['flex', 'items-center', 'justify-center', 'p-2'],
  [BUTTON_SIZE.SMALL]: ['py-0', 'px-2'],
  [BUTTON_SIZE.MEDIUM]: ['py-1', 'px-4'],
  [BUTTON_SIZE.LARGE]: ['py-2', 'px-6'],
};

export const BUTTON_VARIANT = {
  BASIC: 'basic',
  RAISED: 'raised',
  STROKED: 'stroked',
  FLAT: 'flat',
};

export type ButtonVariant = EnumType<typeof BUTTON_VARIANT>;

const VARIANT_CLASSES = {
  [BUTTON_VARIANT.BASIC]: ['bg-transparent', 'border-0'],
  [BUTTON_VARIANT.RAISED]: ['shadow', 'border-0'],
  [BUTTON_VARIANT.STROKED]: ['bg-white', 'border', 'border-gray-500'],
  [BUTTON_VARIANT.FLAT]: ['border-0'],
};

export const BUTTON_COLOR = {
  BASIC: 'basic',
  PRIMARY: 'primary',
  ACCENT: 'accent',
  WARNING: 'warning',
};

export type ButtonColor = EnumType<typeof BUTTON_COLOR>;

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'button',
  standalone: true,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class:
      'rounded-lg outline-none ring-inset transition duration-75 ease-linear focus:ring active:ring',
  },
})
export class ButtonDirective implements OnChanges {
  @Input()
  size: ButtonSize = BUTTON_SIZE.MEDIUM;

  @Input()
  variant: ButtonVariant = BUTTON_VARIANT.BASIC;

  @Input()
  color: ButtonColor = BUTTON_COLOR.BASIC;

  private elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  ngOnChanges(changes: SimpleChanges) {
    if ('size' in changes) {
      this.onSizeChange(changes['size']);
    }

    if ('variant' in changes || 'color' in changes) {
      this.onVariantOrColorChange(changes);
    }
  }

  private onSizeChange(change: SimpleChange) {
    if (change.previousValue) {
      const previousSizeClasses =
        SIZE_CLASSES[change.previousValue as ButtonSize];

      for (const sizeClass of previousSizeClasses) {
        this.elementRef.nativeElement.classList.remove(sizeClass);
      }
    }

    const currentSizeClasses = SIZE_CLASSES[change.currentValue as ButtonSize];

    for (const sizeClass of currentSizeClasses) {
      this.elementRef.nativeElement.classList.add(sizeClass);
    }
  }

  private onVariantOrColorChange(changes: SimpleChanges) {
    if ('variant' in changes) {
      const previousVariantClasses =
        VARIANT_CLASSES[changes['variant'].previousValue as ButtonVariant];

      for (const variantClass of previousVariantClasses) {
        this.elementRef.nativeElement.classList.remove(variantClass);
      }
    }

    const currentVariantClasses = VARIANT_CLASSES[this.variant];

    for (const variantClass of currentVariantClasses) {
      this.elementRef.nativeElement.classList.add(variantClass);
    }
  }
}

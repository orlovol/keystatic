import { FocusableProps } from '@react-types/shared';
import { ReactNode } from 'react';

import { BaseStyleProps } from '@voussoir/style';
import { DOMProps, InputBaseProps } from '@voussoir/types';

export type ToggleProps = {
  /**
   * The label for the element.
   */
  children?: ReactNode;
  /**
   * Whether the element should be selected (uncontrolled).
   */
  defaultSelected?: boolean;
  /**
   * Whether the element should be selected (controlled).
   */
  isSelected?: boolean;
  /**
   * Handler that is called when the element's selection state changes.
   */
  onChange?: (isSelected: boolean) => void;
  /**
   * The value of the input element, used when submitting an HTML form. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefvalue).
   */
  value?: string;
  /**
   * The name of the input element, used when submitting an HTML form. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefname).
   */
  name?: string;
} & InputBaseProps &
  FocusableProps;

export type CheckboxProps = {
  /**
   * Indeterminism is presentational only.
   * The indeterminate visual representation remains regardless of user interaction.
   */
  isIndeterminate?: boolean;
} & ToggleProps &
  BaseStyleProps &
  DOMProps;

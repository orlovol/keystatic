import { ForwardedRef, forwardRef } from 'react';
import { useLocale } from '@react-aria/i18n';
import { useNumberField } from '@react-aria/numberfield';
import { useObjectRef } from '@react-aria/utils';
import { useNumberFieldState } from '@react-stately/numberfield';

import { useProvider, useProviderProps } from '@voussoir/core';
import { css, tokenSchema } from '@voussoir/style';
import { TextFieldPrimitive } from '@voussoir/text-field';
import { filterDOMProps, toDataAttributes } from '@voussoir/utils';

import { StepButton } from './StepButton';
import { NumberFieldProps } from './types';

// Props that conflict with `TextFieldPrimitive`. The relevant DOM props are
// passed down via `inputProps`, so nothing is lost, just a type issue.
const omittedProps = new Set(['onChange', 'value', 'defaultValue']);

/**
 * Number fields let users enter a numeric value and incrementally increase or
 * decrease the value with a step-button control.
 */
export const NumberField = forwardRef(function NumberField(
  props: NumberFieldProps,
  forwardedRef: ForwardedRef<HTMLInputElement>
) {
  props = useProviderProps(props);
  let { isReadOnly, isDisabled, hideStepper } = props;

  let { locale } = useLocale();
  let state = useNumberFieldState({ ...props, locale });
  let inputRef = useObjectRef(forwardedRef);
  let {
    groupProps,
    labelProps,
    inputProps,
    incrementButtonProps,
    decrementButtonProps,
    descriptionProps,
    errorMessageProps,
  } = useNumberField(props, state, inputRef);
  let inputWrapperStyleProps = useInputWrapperStyleProps();

  return (
    <TextFieldPrimitive
      width="size.alias.singleLineWidth"
      {...filterDOMProps(props, { omit: omittedProps })}
      descriptionProps={descriptionProps}
      errorMessageProps={errorMessageProps}
      labelProps={labelProps}
      inputWrapperProps={{
        ...groupProps,
        ...inputWrapperStyleProps,
      }}
      ref={inputRef}
      inputProps={inputProps}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      // NOTE: step buttons must be a sibling of the `<input/>` AND after it
      // in the DOM, so we can respond to pseudo-classes.
      endElement={
        !hideStepper && (
          <>
            <StepButton direction="up" {...incrementButtonProps} />
            <StepButton direction="down" {...decrementButtonProps} />
          </>
        )
      }
    />
  );
});

function useInputWrapperStyleProps() {
  let { scale } = useProvider();
  let className = css({
    display: 'grid',
    gap: tokenSchema.size.border.regular,
    gridTemplateColumns: `1fr calc(${tokenSchema.size.element.regular} - ${tokenSchema.size.border.regular} * 2) ${tokenSchema.size.border.regular}`,
    gridTemplateRows: `${tokenSchema.size.border.regular} auto auto ${tokenSchema.size.border.regular}`,
    gridTemplateAreas:
      '"field . ." "field increment ." "field decrement ." "field . ."',

    '&[data-scale="large"]': {
      gridTemplateColumns: `${tokenSchema.size.element.regular} 1fr ${tokenSchema.size.element.regular}`,
      gridTemplateRows: 'auto',
      gridTemplateAreas: '"decrement field increment"',
    },

    input: {
      gridArea: 'field',
    },
  });

  return { ...toDataAttributes({ scale }), className };
}

import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, StrictMode } from 'react';

import { TestProvider } from '@voussoir/core';

export function renderWithProvider(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: StrictModeProvider, ...options });
}

export function customRender(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: StrictModeWrapper, ...options });
}

function StrictModeWrapper(props: { children: ReactElement }) {
  if (process.env.STRICT_MODE) {
    return <StrictMode>{props.children}</StrictMode>;
  }

  return props.children;
}

function StrictModeProvider(props: { children: ReactElement }) {
  return (
    <StrictModeWrapper>
      <TestProvider>{props.children}</TestProvider>
    </StrictModeWrapper>
  );
}

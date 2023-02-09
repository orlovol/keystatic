import { createContext, useContext } from 'react';

import { TextProps } from '@voussoir/types';

export type TextContextType = Pick<TextProps, 'color' | 'size' | 'weight'>;

export const TextContext = createContext<TextContextType | undefined>(
  undefined
);

export function useTextContext() {
  return useContext(TextContext);
}

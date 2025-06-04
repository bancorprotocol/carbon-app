import { memo } from 'react';
import { SuggestionCombobox } from './SuggestionCombobox';

export default memo(
  SuggestionCombobox,
  (prev, next) => prev.open === next.open,
);

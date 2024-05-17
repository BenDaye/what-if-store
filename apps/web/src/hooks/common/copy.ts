import { useCallback } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';
import { useNotice } from '../notice';

export const useCopy = (notify = true) => {
  const { showSuccess } = useNotice();
  const [, copy] = useCopyToClipboard();
  const onCopy = useCallback(
    async (value?: string | null) => {
      if (!value) return;
      await copy(value);
      notify && showSuccess(`已复制 ${value}`);
    },
    [copy, showSuccess, notify],
  );

  return onCopy;
};

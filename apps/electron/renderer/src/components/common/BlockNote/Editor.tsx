import type { OverridesProps } from '@/types/overrides';
import { NOOP } from '@/utils/noop';
import type { PartialBlock } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import '@blocknote/mantine/style.css';
import type { BoxProps } from '@mui/material';
import { Box } from '@mui/material';
import { useDebounceCallback } from 'usehooks-ts';

type BlockNoteEditorProps = OverridesProps<{ BoxProps?: BoxProps }> & {
  minHeight?: string | number;
  initialContent?: PartialBlock[];
  editable?: boolean;
  onChange?: (content: PartialBlock[]) => void;
};

export const BlockNoteEditor = ({
  overrides,
  minHeight = 480,
  initialContent,
  editable = false,
  onChange = NOOP,
}: BlockNoteEditorProps) => {
  const editor = useCreateBlockNote(
    {
      initialContent,
    },
    [initialContent],
  );

  const handleChange = useDebounceCallback(onChange, 5 * 1000);

  return (
    <Box
      sx={{
        minHeight,
        outline: 0,
        overflow: 'auto',
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: 'column',
      }}
      {...overrides?.BoxProps}
    >
      <BlockNoteView
        editor={editor}
        data-blocknote
        editable={editable}
        onChange={() => handleChange(editor.document)}
      />
    </Box>
  );
};

export default BlockNoteEditor;

import '@blocknote/core/fonts/inter.css';
import { BlockNoteView, useCreateBlockNote } from '@blocknote/react';
import '@blocknote/react/style.css';

export const BlockNoteEditor = () => {
  const editor = useCreateBlockNote();

  return <BlockNoteView editor={editor} data-blocknote />;
};

export default BlockNoteEditor;
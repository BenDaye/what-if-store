import { useNotice } from '@/hooks';
import type { OverridesProps } from '@/types/overrides';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import type { InitialConfigType } from '@lexical/react/LexicalComposer';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { Box, Card, CardContent, Divider, Typography, useTheme } from '@mui/material';
import { ToolbarPlugin } from './plugins/ToolbarPlugin';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';

type LexicalProps = OverridesProps<{
  initialConfig?: InitialConfigType;
}> & {
  namespace: string;
  placeholderText?: string;
  minHeight?: string | number;
};

export const Lexical = ({ overrides, namespace, placeholderText = '', minHeight = 480 }: LexicalProps) => {
  const muiTheme = useTheme();
  const { showError } = useNotice();

  return (
    <LexicalComposer
      initialConfig={{
        namespace,
        onError: (error) => showError(error.message),
        theme: PlaygroundEditorTheme,
        ...overrides?.initialConfig,
      }}
    >
      <Card sx={{ position: 'relative' }}>
        <ToolbarPlugin />
        <Divider />
        <CardContent
          sx={{
            position: 'relative',
            p: 0,
          }}
        >
          <RichTextPlugin
            contentEditable={
              <Box
                sx={{
                  position: 'relative',
                  minHeight,
                  outline: 0,
                  display: 'flex',
                  overflow: 'auto',
                  resize: 'vertical',
                  zIndex: 0,
                }}
              >
                <Box
                  sx={{
                    flex: 'auto',
                    position: 'relative',
                    resize: 'vertical',
                    zIndex: -1,
                  }}
                >
                  <ContentEditable
                    style={{
                      border: 0,
                      outline: 0,
                      display: 'block',
                      position: 'relative',
                      minHeight,
                      paddingTop: muiTheme.spacing(1),
                      paddingLeft: muiTheme.spacing(2),
                      paddingRight: muiTheme.spacing(2),
                      paddingBottom: muiTheme.spacing(5),
                    }}
                  />
                </Box>
              </Box>
            }
            placeholder={
              <Typography
                color="text.disabled"
                variant="body2"
                sx={{
                  position: 'absolute',
                  textOverflow: 'ellipsis',
                  top: muiTheme.spacing(1),
                  left: muiTheme.spacing(2),
                  right: muiTheme.spacing(2),
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                  pointerEvents: 'none',
                }}
              >
                {placeholderText}
              </Typography>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
        </CardContent>
        <Box />
      </Card>
    </LexicalComposer>
  );
};

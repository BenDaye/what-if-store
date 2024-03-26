import { UseDashboardApplicationHookDataSchema, useNotice } from '@/hooks';
import { OverridesCardProps } from '@/types/overrides';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
// import { $getRoot, $getSelection } from 'lexical';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import ToolbarPlugin from './LexicalToolbarPlugin';

type PrivacyPolicySectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const PrivacyPolicySectionCard = ({
  overrides,
  defaultValues,
}: PrivacyPolicySectionCardProps) => {
  const { t: tApplicationPrivacyPolicy } = useTranslation('application', {
    keyPrefix: 'PrivacyPolicy',
  });
  const { showError } = useNotice();

  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardHeader
        title={tApplicationPrivacyPolicy('_', 'PrivacyPolicy')}
        {...overrides?.CardHeaderProps}
      />
      <CardContent {...overrides?.CardContentProps}>
        <LexicalComposer
          initialConfig={{
            namespace: 'PrivacyPolicy',
            onError: (error) => showError(error.message),
          }}
        >
          <Card sx={{ position: 'relative' }}>
            <ToolbarPlugin />
            <Divider />
            <CardContent sx={{ position: 'relative' }}>
              <RichTextPlugin
                contentEditable={<ContentEditable />}
                placeholder={
                  <Typography color="text.disabled">
                    {tApplicationPrivacyPolicy('Placeholder', '')}
                  </Typography>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <AutoFocusPlugin />
            </CardContent>
          </Card>
        </LexicalComposer>
      </CardContent>
    </Card>
  );
};

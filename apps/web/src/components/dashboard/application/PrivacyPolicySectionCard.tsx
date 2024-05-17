// import { Lexical } from '@/components/common';
import { FallbackId } from '@/constants/common';
import {
  useDashboardApplicationAsset,
  UseDashboardApplicationHookDataSchema,
  useNotice,
} from '@/hooks';
import { OverridesCardProps } from '@/types/overrides';
import { trpc } from '@/utils/trpc';
import { PartialBlock } from '@blocknote/core';
import { Card, CardContent, CardHeader } from '@mui/material';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useCallback } from 'react';

const Editor = dynamic(() => import('../../common/BlockNote/Editor'), {
  ssr: false,
});

type PrivacyPolicySectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const PrivacyPolicySectionCard = ({
  overrides,
  defaultValues: { id: applicationId, privacyPolicy: id },
}: PrivacyPolicySectionCardProps) => {
  const { t } = useTranslation();

  const {
    data,
    router: { isError, isFetching },
  } = useDashboardApplicationAsset(id ?? FallbackId);
  const { showError } = useNotice();
  const { mutateAsync: upsert } =
    trpc.protectedDashboardApplicationAsset.upsertFileContent.useMutation({
      onError: (err) => showError(err.message),
    });

  const onChange = useCallback(
    async (content: PartialBlock[]) => {
      await upsert({ applicationId, name: 'PrivacyPolicy', content }).catch(
        () => null,
      );
    },
    [upsert, applicationId],
  );

  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardHeader
        title={t('application:PrivacyPolicy._')}
        {...overrides?.CardHeaderProps}
      />
      <CardContent {...overrides?.CardContentProps}>
        {/* <Lexical
          namespace="PrivacyPolicy"
          placeholderText={tApplicationPrivacyPolicy('Placeholder', '')}
        /> */}
        <Editor
          initialContent={data.content}
          editable={!isError && !isFetching}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};

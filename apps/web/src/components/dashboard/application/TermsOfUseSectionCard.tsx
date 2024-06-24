import { FallbackId } from '@/constants/common';
import type { UseDashboardApplicationHookDataSchema } from '@/hooks';
import { useDashboardApplicationAsset, useNotice } from '@/hooks';
import type { OverridesCardProps } from '@/types/overrides';
import type { PartialBlock } from '@blocknote/core';
import { Card, CardContent, CardHeader } from '@mui/material';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useCallback } from 'react';
import { trpc } from '@what-if-store/server/next/trpc';

const Editor = dynamic(() => import('../../common/BlockNote/Editor'), {
  ssr: false,
});

type TermsOfUseSectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const TermsOfUseSectionCard = ({
  overrides,
  defaultValues: { id: applicationId, termsOfUse: id },
}: TermsOfUseSectionCardProps) => {
  const { t } = useTranslation();

  const {
    data,
    router: { isError, isFetching },
  } = useDashboardApplicationAsset(id ?? FallbackId);
  const { showError } = useNotice();
  const { mutateAsync: upsert } = trpc.protectedDashboardApplicationAsset.upsertFileContent.useMutation({
    onError: (err) => showError(err.message),
  });

  const onChange = useCallback(
    async (content: PartialBlock[]) => {
      await upsert({ applicationId, name: 'TermsOfUse', content }).catch(() => null);
    },
    [upsert, applicationId],
  );

  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardHeader title={t('application:TermsOfUse._')} {...overrides?.CardHeaderProps} />
      <CardContent {...overrides?.CardContentProps}>
        <Editor initialContent={data.content} editable={!isError && !isFetching} onChange={onChange} />
      </CardContent>
    </Card>
  );
};

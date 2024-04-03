import {
  UseDashboardApplicationHookDataSchema,
  useDashboardApplicationAsset,
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

type TermsOfUseSectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const TermsOfUseSectionCard = ({
  overrides,
  defaultValues: { termsOfUse },
}: TermsOfUseSectionCardProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tApplicationTermsOfUse } = useTranslation('application', {
    keyPrefix: 'TermsOfUse',
  });

  const {
    data,
    router: { isError, isFetching },
  } = useDashboardApplicationAsset(termsOfUse ?? '');
  const { showSuccess, showError } = useNotice();
  const { mutateAsync: update, isPending } =
    trpc.protectedDashboardApplicationAsset.updateById.useMutation({
      onError: (err) => showError(err.message),
      onSuccess: () => showSuccess(tCommon('Updated', 'Updated')),
    });

  const onChange = useCallback(
    async (content: PartialBlock[]) => {
      await update({ ...data, content }).catch(() => null);
    },
    [update, data],
  );

  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardHeader
        title={tApplicationTermsOfUse('_', 'Terms Of Use')}
        {...overrides?.CardHeaderProps}
      />
      <CardContent {...overrides?.CardContentProps}>
        <Editor
          initialContent={data.content}
          editable={!isError && !isFetching && !isPending}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};

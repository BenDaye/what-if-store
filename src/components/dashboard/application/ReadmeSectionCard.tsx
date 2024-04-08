// import { Lexical } from '@/components/common';
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

type ReadmeSectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const ReadmeSectionCard = ({
  overrides,
  defaultValues: { id: applicationId, readme: id },
}: ReadmeSectionCardProps) => {
  const { t: tApplicationReadme } = useTranslation('application', {
    keyPrefix: 'Readme',
  });

  const {
    data,
    router: { isError, isFetching },
  } = useDashboardApplicationAsset(id ?? '');
  const { showError } = useNotice();
  const { mutateAsync: upsert } =
    trpc.protectedDashboardApplicationAsset.upsertFileContent.useMutation({
      onError: (err) => showError(err.message),
    });

  const onChange = useCallback(
    async (content: PartialBlock[]) => {
      await upsert({ applicationId, name: 'Readme', content }).catch(
        () => null,
      );
    },
    [upsert, applicationId],
  );

  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardHeader
        title={tApplicationReadme('_', 'Readme')}
        {...overrides?.CardHeaderProps}
      />
      <CardContent {...overrides?.CardContentProps}>
        {/* <Lexical
          namespace="Readme"
          placeholderText={tApplicationReadme('Placeholder', '')}
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

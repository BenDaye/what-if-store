import { useDashboardApplication } from '@/hooks';
import { IdSchema } from '@/server/schemas';
import { OverridesCardProps } from '@/types/overrides';
import { Card, CardContent } from '@mui/material';
import { ExtraSectionCard } from './ExtraSectionCard';
import { GeneralSectionCard } from './GeneralSectionCard';
import { UserSectionCard } from './UserSectionCard';

type GeneralCardProps = OverridesCardProps & {
  applicationId: IdSchema;
};

export const GeneralCard = ({ applicationId, overrides }: GeneralCardProps) => {
  const { name, provider, data, description, category, website, github } =
    useDashboardApplication(applicationId);
  return (
    <Card sx={{ flexGrow: 1 }} {...overrides?.CardProps}>
      <CardContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        {...overrides?.CardContentProps}
      >
        <GeneralSectionCard
          defaultValues={{
            id: applicationId,
            name,
            description,
            category,
            website,
            github,
          }}
        />
        <ExtraSectionCard
          defaultValues={{
            id: applicationId,
            countries: data?.countries,
            locales: data?.Information?.locales,
            tags: data?.Tags,
          }}
        />
        {provider?.id && <UserSectionCard userId={provider.id} />}
      </CardContent>
    </Card>
  );
};

import {
  UseDashboardApplicationHookDataSchema,
  useDashboardUser,
} from '@/hooks';
import { IdSchema } from '@/server/schemas';
import { OverridesCardProps } from '@/types/overrides';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

type UserSectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const UserSectionCard = ({
  overrides,
  defaultValues,
}: UserSectionCardProps) => {
  const userId = defaultValues.provider?.id;
  if (!userId) return null;
  return <SectionCard userId={userId} overrides={overrides} />;
};

type SectionCardProps = OverridesCardProps & {
  userId: IdSchema;
};

const SectionCard = ({ overrides, userId }: SectionCardProps) => {
  const { push } = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tApplicationGeneral } = useTranslation('application', {
    keyPrefix: 'General',
  });
  const { t: tUserGeneral } = useTranslation('user', {
    keyPrefix: 'General',
  });
  const { t: tProviderGeneral } = useTranslation('provider', {
    keyPrefix: 'General',
  });
  const {
    data: { nickname, providerName },
  } = useDashboardUser(userId);
  return (
    <Card variant="outlined" {...overrides?.CardProps}>
      <CardHeader
        title={tApplicationGeneral('User', 'User General')}
        {...overrides?.CardHeaderProps}
      />
      <CardContent {...overrides?.CardContentProps}>
        <Grid container spacing={1}>
          <Grid md={12} xl>
            <TextField
              value={nickname}
              label={tUserGeneral('Name', 'User Nickname')}
              placeholder={tUserGeneral('Name', 'User Nickname')}
              disabled
            />
          </Grid>

          <Grid md={12} xl={6}>
            <TextField
              value={providerName}
              label={tProviderGeneral('Name', 'Provider Name')}
              placeholder={tProviderGeneral('Name', 'Provider Name')}
              disabled
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions {...overrides?.CardActionsProps}>
        <Box flexGrow={1} />
        <Button onClick={() => push(`/dashboard/user/${userId}`)}>
          {tCommon('View', 'View')}
        </Button>
      </CardActions>
    </Card>
  );
};

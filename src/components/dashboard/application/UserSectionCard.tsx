import { useDashboardUser } from '@/hooks';
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
  userId: IdSchema;
};

export const UserSectionCard = ({ userId }: UserSectionCardProps) => {
  const { push } = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tApplication } = useTranslation('application', {
    keyPrefix: 'General',
  });
  const { t: tUser } = useTranslation('user', {
    keyPrefix: 'General',
  });
  const { t: tProvider } = useTranslation('provider', {
    keyPrefix: 'General',
  });
  const { nickname, provider } = useDashboardUser(userId);
  return (
    <Card variant="outlined">
      <CardHeader title={tApplication('User', 'User General')} />
      <CardContent>
        <Grid container spacing={1}>
          <Grid md={12} xl>
            <TextField
              value={nickname}
              label={tUser('Name', 'User Nickname')}
              placeholder={tUser('Name', 'User Nickname')}
              disabled
            />
          </Grid>
          {provider && (
            <Grid md={12} xl={6}>
              <TextField
                value={provider.name}
                label={tProvider('Name', 'Provider Name')}
                placeholder={tProvider('Name', 'Provider Name')}
                disabled
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
      <CardActions>
        <Box flexGrow={1} />
        <Button onClick={() => push(`/dashboard/user/${userId}`)}>
          {tCommon('View', 'View')}
        </Button>
      </CardActions>
    </Card>
  );
};

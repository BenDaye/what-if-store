import type { UseDashboardApplicationHookDataSchema } from '@/hooks';
import type { OverridesCardProps } from '@/types/overrides';
import { Button, Card, CardContent, CardHeader, List, ListItem, ListItemText } from '@mui/material';
import { AuthRole } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { ChangeStatusButton } from './ChangeStatusButton';

type DangerZoneSectionCardProps = OverridesCardProps & {
  defaultValues: UseDashboardApplicationHookDataSchema;
};

export const DangerZoneSectionCard = ({
  overrides,
  defaultValues: { id: applicationId, status },
}: DangerZoneSectionCardProps) => {
  const { t } = useTranslation();

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: 'error.main',
      }}
      {...overrides?.CardProps}
    >
      <CardHeader
        title={t('application:General.DangerZone._')}
        titleTypographyProps={{
          color: 'error',
        }}
        {...overrides?.CardHeaderProps}
      />
      <CardContent component={List} {...overrides?.CardContentProps}>
        <ListItem divider sx={{ gap: 1 }}>
          <ListItemText
            primary={t('application:General.DangerZone.ChangeStatus.Title')}
            secondary={t('application.General.DangerZone.ChangeStatus.Description')}
            secondaryTypographyProps={{
              whiteSpace: 'pre-line',
            }}
          />
          <ChangeStatusButton
            overrides={{
              ButtonProps: {
                sx: { flexShrink: 0 },
              },
            }}
            applicationId={applicationId}
            defaultValue={status}
            role={AuthRole.Admin}
          />
        </ListItem>
        <ListItem divider sx={{ gap: 1 }}>
          <ListItemText
            primary={t('application:General.DangerZone.Transfer.Title')}
            secondary={t('application:General.DangerZone.Transfer.Description')}
            secondaryTypographyProps={{
              whiteSpace: 'pre-line',
            }}
          />
          <Button color="error" variant="contained" sx={{ flexShrink: 0 }} disableElevation>
            {t('application:General.DangerZone.Transfer.Button')}
          </Button>
        </ListItem>
        <ListItem sx={{ gap: 1 }}>
          <ListItemText
            primary={t('application:General.DangerZone.Delete.Title')}
            secondary={t('application:General.DangerZone.Delete.Description')}
            secondaryTypographyProps={{
              whiteSpace: 'pre-line',
            }}
          />
          <Button color="error" variant="contained" sx={{ flexShrink: 0 }} disableElevation>
            {t('application:General.DangerZone.Delete.Button')}
          </Button>
        </ListItem>
      </CardContent>
    </Card>
  );
};

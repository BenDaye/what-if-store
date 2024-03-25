import { UseDashboardApplicationHookDataSchema } from '@/hooks';
import { OverridesCardProps } from '@/types/overrides';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
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
  const { t: tApplicationGeneralDangerZone } = useTranslation('application', {
    keyPrefix: 'General.DangerZone',
  });

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: 'error.main',
      }}
      {...overrides?.CardProps}
    >
      <CardHeader
        title={tApplicationGeneralDangerZone('_', 'Danger Zone')}
        titleTypographyProps={{
          color: 'error',
        }}
        {...overrides?.CardHeaderProps}
      />
      <CardContent component={List} {...overrides?.CardContentProps}>
        <ListItem divider sx={{ gap: 1 }}>
          <ListItemText
            primary={tApplicationGeneralDangerZone(
              'ChangeStatus.Title',
              'Change application status',
            )}
            secondary={tApplicationGeneralDangerZone(
              'ChangeStatus.Description',
              'Changing the status is a queued task.\nThis operation will wait for some dependent tasks to align with the new status before it is completed.',
            )}
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
            primary={tApplicationGeneralDangerZone(
              'Transfer.Title',
              'Transfer ownership',
            )}
            secondary={tApplicationGeneralDangerZone(
              'Transfer.Description',
              'Transfer this application to another provider.',
            )}
            secondaryTypographyProps={{
              whiteSpace: 'pre-line',
            }}
          />
          <Button
            color="error"
            variant="contained"
            sx={{ flexShrink: 0 }}
            disableElevation
          >
            {tApplicationGeneralDangerZone('Transfer.Button', 'Transfer')}
          </Button>
        </ListItem>
        <ListItem sx={{ gap: 1 }}>
          <ListItemText
            primary={tApplicationGeneralDangerZone(
              'Delete.Title',
              'Delete this application',
            )}
            secondary={tApplicationGeneralDangerZone(
              'Delete.Description',
              'Once you delete a application, there is no going back. Please be certain.\nThis operation is higher priority than change application status to "Deleted".',
            )}
            secondaryTypographyProps={{
              whiteSpace: 'pre-line',
            }}
          />
          <Button
            color="error"
            variant="contained"
            sx={{ flexShrink: 0 }}
            disableElevation
          >
            {tApplicationGeneralDangerZone('Delete.Button', 'Delete')}
          </Button>
        </ListItem>
      </CardContent>
    </Card>
  );
};

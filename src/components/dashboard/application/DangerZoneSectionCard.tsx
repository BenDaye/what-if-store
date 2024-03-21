import { IdSchema } from '@/server/schemas';
import { OverridesCardProps } from '@/types/overrides';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from '@mui/material';
import { ApplicationStatus } from '@prisma/client';
import { useTranslation } from 'next-i18next';

type DangerZoneSectionCardProps = OverridesCardProps & {
  applicationId: IdSchema;
  status: ApplicationStatus;
};

export const DangerZoneSectionCard = ({
  overrides,
  applicationId,
  status,
}: DangerZoneSectionCardProps) => {
  const { t: tDangerZone } = useTranslation('application', {
    keyPrefix: 'General.DangerZone',
  });
  const { t: tApplicationStatus } = useTranslation('application', {
    keyPrefix: 'Status',
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
        title={tDangerZone('_', 'Danger Zone')}
        titleTypographyProps={{
          color: 'error',
        }}
        {...overrides?.CardHeaderProps}
      />
      <CardContent component={List} {...overrides?.CardContentProps}>
        <ListItem divider>
          <ListItemText
            primary={tDangerZone('ChangeStatus', 'Change application status')}
            secondary={tDangerZone(
              'CurrentStatus',
              'This application status is currently {{status}}.',
              { status },
            )}
            secondaryTypographyProps={{
              whiteSpace: 'pre-line',
            }}
          />
          <ListItemSecondaryAction>
            <Button
              color="error"
              variant="contained"
              disableElevation
              endIcon={<KeyboardArrowDownIcon />}
            >
              {tApplicationStatus(status, status)}
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem divider>
          <ListItemText
            primary={tDangerZone('TransferTitle', 'Transfer ownership')}
            secondary={tDangerZone(
              'TransferDescription',
              'Transfer this application to another provider.',
            )}
            secondaryTypographyProps={{
              whiteSpace: 'pre-line',
            }}
          />
          <ListItemSecondaryAction>
            <Button color="error" variant="contained">
              {tDangerZone('TransferButton', 'Transfer')}
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText
            primary={tDangerZone('DeleteTitle', 'Delete this application')}
            secondary={tDangerZone(
              'DeleteDescription',
              'Once you delete a application, there is no going back. Please be certain.\nThis operation is higher priority than change application status to "Deleted".',
            )}
            secondaryTypographyProps={{
              whiteSpace: 'pre-line',
            }}
          />
          <ListItemSecondaryAction>
            <Button color="error" variant="contained">
              {tDangerZone('DeleteButton', 'Delete')}
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      </CardContent>
    </Card>
  );
};

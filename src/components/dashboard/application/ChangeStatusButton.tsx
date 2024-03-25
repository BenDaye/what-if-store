import { useNotice } from '@/hooks';
import { IdSchema } from '@/server/schemas';
import { OverridesProps } from '@/types/overrides';
import { trpc } from '@/utils/trpc';
import { getAvailableStatuses } from '@/utils/validApplicationStatusTransition';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import {
  Button,
  ButtonProps,
  ListItemText,
  Menu,
  MenuItem,
  MenuItemProps,
  MenuProps,
  Tooltip,
  Typography,
} from '@mui/material';
import { ApplicationStatus, AuthRole } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useMemo, useRef } from 'react';
import { useBoolean } from 'usehooks-ts';

type ChangeStatusButtonProps = OverridesProps<{
  ButtonProps?: ButtonProps;
  MenuProps?: MenuProps;
  MenuItemProps?: MenuItemProps;
}> & {
  applicationId: IdSchema;
  defaultValue: ApplicationStatus;
  role?: AuthRole;
};

export const ChangeStatusButton = ({
  overrides,
  applicationId,
  defaultValue,
  role,
}: ChangeStatusButtonProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tApplicationStatus } = useTranslation('application', {
    keyPrefix: 'Status',
  });
  const { t: tApplicationGeneralDangerZoneChangeStatus } = useTranslation(
    'application',
    {
      keyPrefix: 'General.DangerZone.ChangeStatus',
    },
  );
  const anchorRef = useRef<HTMLButtonElement>(null);
  const {
    value: menuVisible,
    setTrue: openMenu,
    setFalse: closeMenu,
  } = useBoolean(false);
  const availableStatuses = useMemo(
    () => getAvailableStatuses(defaultValue, role),
    [defaultValue, role],
  );

  const { showSuccess, showError } = useNotice();
  const { mutateAsync: update, isPending } =
    trpc.protectedDashboardApplication.changeStatusById.useMutation({
      onError: (err) => showError(err.message),
      onSuccess: () => showSuccess(tCommon('Updated', 'Updated')),
    });

  const onSubmit = async (status: ApplicationStatus) =>
    await update({ status, id: applicationId }).catch(() => null);

  return (
    <>
      <Button
        color="error"
        variant="contained"
        disableElevation
        endIcon={<KeyboardArrowDownIcon />}
        ref={anchorRef}
        onClick={() => openMenu()}
        disabled={isPending}
        {...overrides?.ButtonProps}
      >
        {tApplicationStatus(defaultValue, defaultValue)}
      </Button>
      {anchorRef.current && (
        <Menu
          open={menuVisible}
          anchorEl={anchorRef.current}
          onClose={() => closeMenu()}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{
            paper: {
              sx: {
                width: 180,
              },
            },
          }}
          onClick={() => closeMenu()}
          {...overrides?.MenuProps}
        >
          {availableStatuses.map((status) => (
            <MenuItem
              key={status}
              disabled={isPending}
              onClick={() => onSubmit(status)}
            >
              <Tooltip
                title={
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {tApplicationGeneralDangerZoneChangeStatus(
                      `${status}.Description`,
                      status,
                    )}
                  </Typography>
                }
                arrow
                placement="left"
              >
                <ListItemText
                  primary={tApplicationGeneralDangerZoneChangeStatus(
                    `${status}.Button`,
                    status,
                  )}
                  primaryTypographyProps={{
                    color: 'error',
                  }}
                  secondary={tApplicationGeneralDangerZoneChangeStatus(
                    `${status}.Title`,
                    status,
                  )}
                  secondaryTypographyProps={{
                    noWrap: true,
                  }}
                />
              </Tooltip>
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};

import { useNotice } from '@/hooks';
import type { OverridesProps } from '@/types/overrides';
import { KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';
import type { ButtonProps, MenuItemProps, MenuProps } from '@mui/material';
import { Button, ListItemText, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useMemo, useRef } from 'react';
import { useBoolean } from 'usehooks-ts';
import type { ApplicationStatus, AuthRole } from '@what-if-store/prisma/client';
import { trpc } from '@what-if-store/server/next/trpc';
import type { IdSchema } from '@what-if-store/server/server/schemas';
import { getAvailableStatuses } from '@what-if-store/utils/validator';

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
  const { t } = useTranslation();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const { value: menuVisible, setTrue: openMenu, setFalse: closeMenu } = useBoolean(false);
  const availableStatuses = useMemo(() => getAvailableStatuses(defaultValue, role), [defaultValue, role]);

  const { showSuccess, showError } = useNotice();
  const { mutateAsync: update, isPending } = trpc.protectedDashboardApplication.changeStatusById.useMutation({
    onError: (err) => showError(err.message),
    onSuccess: () => showSuccess(t('common:Updated')),
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
        {t(`application:Status.Text.${defaultValue}`)}
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
            <MenuItem key={status} disabled={isPending} onClick={() => onSubmit(status)}>
              <Tooltip
                title={
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {t(`application.DangerZone.ChangeStatus.${status}.Description`)}
                  </Typography>
                }
                arrow
                placement="left"
              >
                <ListItemText
                  primary={t(`application.DangerZone.ChangeStatus.${status}.Button`)}
                  primaryTypographyProps={{
                    color: 'error',
                  }}
                  secondary={t(`application.DangerZone.ChangeStatus.${status}.Title`)}
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

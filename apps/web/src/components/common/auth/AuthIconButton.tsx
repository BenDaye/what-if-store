import type { OverridesProps } from '@/types/overrides';
import { AccountCircle as AuthIcon } from '@mui/icons-material';
import type { IconButtonProps, MenuProps } from '@mui/material';
import { Menu } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import type { PropsWithChildren } from 'react';
import { useRef } from 'react';
import { useBoolean } from 'usehooks-ts';
import type { IconButtonWithTooltipProps } from '../IconButtonWithTooltip';
import { IconButtonWithTooltip } from '../IconButtonWithTooltip';
import { AuthApiKeyDialog } from './ApiKeyDialog';
import { ApiKeyMenuItem } from './ApiKeyMenuItem';
import { SessionMenuItem } from './SessionMenuItem';
import { SignOutMenuItem } from './SignOutMenuItem';
import { AuthUpdateProfileDialog } from './UpdateProfileDialog';

type AuthIconButtonProps = OverridesProps<{
  IconButtonProps?: IconButtonProps;
  IconButtonWithTooltipProps?: IconButtonWithTooltipProps;
  MenuProps?: MenuProps;
}> & {
  MenuItems?: React.ReactNode[];
};

export const AuthIconButton = ({
  overrides,
  MenuItems,
  children,
}: PropsWithChildren<AuthIconButtonProps>) => {
  const { t } = useTranslation();

  const { status } = useSession();

  const {
    value: updateProfileDialogVisible,
    setTrue: openUpdateProfileDialog,
    setFalse: closeUpdateProfileDialog,
  } = useBoolean(false);
  const {
    value: apiKeyDialogVisible,
    setTrue: openApiKeyDialog,
    setFalse: closeApiKeyDialog,
  } = useBoolean(false);

  const anchorRef = useRef<HTMLButtonElement>(null);
  const { value: menuVisible, setTrue: openMenu, setFalse: closeMenu } = useBoolean(false);

  return (
    <>
      <IconButtonWithTooltip
        title={t('auth:Profile._')}
        icon={<AuthIcon />}
        active={false}
        onClick={openMenu}
        IconButtonProps={{
          ref: anchorRef,
        }}
        {...overrides?.IconButtonWithTooltipProps}
      />
      {anchorRef.current && (
        <Menu
          open={menuVisible}
          anchorEl={anchorRef.current}
          onClose={() => closeMenu()}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          slotProps={{
            paper: {
              sx: {
                width: 320,
              },
            },
          }}
          onClick={() => closeMenu()}
          {...overrides?.MenuProps}
        >
          <SessionMenuItem
            overrides={{
              MenuItemProps: {
                onClick: status === 'authenticated' ? openUpdateProfileDialog : undefined,
              },
            }}
          />
          {MenuItems?.map((item) => item)}
          {status === 'authenticated' && (
            <ApiKeyMenuItem
              overrides={{
                MenuItemProps: {
                  onClick: openApiKeyDialog,
                },
              }}
            />
          )}
          {status === 'authenticated' && <SignOutMenuItem />}
        </Menu>
      )}
      {children}
      {status === 'authenticated' && (
        <AuthApiKeyDialog
          DialogProps={{
            open: apiKeyDialogVisible,
            onClose: closeApiKeyDialog,
            maxWidth: 'md',
          }}
        />
      )}
      {status === 'authenticated' && (
        <AuthUpdateProfileDialog
          DialogProps={{
            open: updateProfileDialogVisible,
            onClose: closeUpdateProfileDialog,
          }}
        />
      )}
    </>
  );
};

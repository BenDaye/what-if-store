import { OverridesProps } from '@/types/overrides';
import { AccountCircle as AuthIcon } from '@mui/icons-material';
import { IconButtonProps, Menu, MenuProps } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { PropsWithChildren, useRef } from 'react';
import { useBoolean } from 'usehooks-ts';
import {
  IconButtonWithTooltip,
  IconButtonWithTooltipProps,
} from '../IconButtonWithTooltip';
import { SessionMenuItem } from '../settings';
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
  const { t: tAuth } = useTranslation('auth');

  const { status } = useSession();

  const {
    value: updateProfileDialogVisible,
    setTrue: openUpdateProfileDialog,
    setFalse: closeUpdateProfileDialog,
  } = useBoolean(false);

  const anchorRef = useRef<HTMLButtonElement>(null);
  const {
    value: menuVisible,
    setTrue: openMenu,
    setFalse: closeMenu,
  } = useBoolean(false);

  return (
    <>
      <IconButtonWithTooltip
        title={tAuth('Profile._', 'Profile')}
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
                onClick: openUpdateProfileDialog,
              },
            }}
          />
          {MenuItems?.map((item) => item)}
          {status === 'authenticated' && <SignOutMenuItem />}
        </Menu>
      )}
      {children}
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

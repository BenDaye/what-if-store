import { OverridesProps } from '@/types/overrides';
import { AccountCircle as AuthIcon } from '@mui/icons-material';
import { IconButtonProps, Menu, MenuProps } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { PropsWithChildren, useRef } from 'react';
import { useBoolean } from 'usehooks-ts';
import {
  IconButtonWithTooltip,
  IconButtonWithTooltipProps,
} from '../IconButtonWithTooltip';

type AuthIconButtonProps = OverridesProps<{
  IconButtonProps?: IconButtonProps;
  IconButtonWithTooltipProps?: IconButtonWithTooltipProps;
  MenuProps?: MenuProps;
}> & {
  MenuItems: React.ReactNode[];
};

export const AuthIconButton = ({
  overrides,
  MenuItems,
  children,
}: PropsWithChildren<AuthIconButtonProps>) => {
  const { t: tAuth } = useTranslation('auth');
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
      ></IconButtonWithTooltip>
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
          {MenuItems.map((item) => item)}
        </Menu>
      )}
      {children}
    </>
  );
};

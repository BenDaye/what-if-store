import { UpdateLocaleDialog } from '@/components/common/locale/UpdateDialog';
import { Settings as SettingsIcon } from '@mui/icons-material';
import type { DialogProps, MenuProps } from '@mui/material';
import { Box, Button, ButtonGroup, ListItem, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import type { AuthRole } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import type { PropsWithChildren } from 'react';
import { useRef } from 'react';
import { useBoolean, useTernaryDarkMode } from 'usehooks-ts';
import type { IconButtonWithTooltipProps } from '..';
import { IconButtonWithTooltip } from '..';

type SettingsIconButtonProps = {
  role?: AuthRole;
  enableCommonMenuItems?: boolean;
  appendMenuItems?: React.ReactNode[];
  prependMenuItems?: React.ReactNode[];
  overrides?: {
    IconButtonWithTooltipProps?: IconButtonWithTooltipProps;
    MenuProps?: MenuProps;
    LocaleDialogProps?: DialogProps;
  };
};

export const SettingsIconButton = (props: PropsWithChildren<SettingsIconButtonProps>) => {
  const router = useRouter();
  const { t } = useTranslation();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const { value: menuVisible, setTrue: openMenu, setFalse: closeMenu } = useBoolean(false);
  const {
    value: updateLocaleDialogVisible,
    setTrue: openUpdateLocaleDialog,
    setFalse: closeUpdateLocaleDialog,
  } = useBoolean(false);
  const { ternaryDarkMode, setTernaryDarkMode } = useTernaryDarkMode();
  return (
    <>
      <IconButtonWithTooltip
        title={t('common:Settings')}
        icon={<SettingsIcon />}
        active={false}
        onClick={openMenu}
        IconButtonProps={{
          ref: anchorRef,
        }}
        {...props.overrides?.IconButtonWithTooltipProps}
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
          {...props.overrides?.MenuProps}
        >
          {props.prependMenuItems?.map((item) => item)}
          {props.enableCommonMenuItems && (
            <ListItem
              dense
              onClick={(ev) => {
                ev.stopPropagation();
              }}
            >
              <ListItemText
                primary={t('common:DarkMode._')}
                primaryTypographyProps={{ color: 'text.secondary' }}
              />
              <ButtonGroup size="small" onClick={(ev) => ev.stopPropagation()} disableElevation>
                <Button
                  onClick={() => {
                    setTernaryDarkMode('light');
                  }}
                  variant={ternaryDarkMode === 'light' ? 'contained' : undefined}
                >
                  {t('common:DarkMode.Off')}
                </Button>
                <Button
                  onClick={() => {
                    setTernaryDarkMode('dark');
                  }}
                  variant={ternaryDarkMode === 'dark' ? 'contained' : undefined}
                >
                  {t('common:DarkMode.On')}
                </Button>
                <Button
                  onClick={() => {
                    setTernaryDarkMode('system');
                  }}
                  variant={ternaryDarkMode === 'system' ? 'contained' : undefined}
                >
                  {t('common:DarkMode.Auto')}
                </Button>
              </ButtonGroup>
            </ListItem>
          )}
          {props.enableCommonMenuItems && (
            <MenuItem dense onClick={() => openUpdateLocaleDialog()}>
              <ListItemText
                primary={t('common:Language._')}
                primaryTypographyProps={{ color: 'text.secondary' }}
              />
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'nowrap',
                  alignItems: 'center',
                  flexShrink: 0,
                  gap: 1,
                }}
              >
                <Typography variant="body2">
                  {t(`common:Language.${router.locale}`, {
                    defaultValue: router.locale,
                  })}
                </Typography>
              </Box>
            </MenuItem>
          )}
          {props.appendMenuItems?.map((item) => item)}
        </Menu>
      )}
      <UpdateLocaleDialog
        open={updateLocaleDialogVisible}
        onClose={() => closeUpdateLocaleDialog()}
        {...props.overrides?.LocaleDialogProps}
      />
      {props.children}
    </>
  );
};

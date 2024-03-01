import { UpdateLocaleDialog } from '@/components/common/locale/UpdateDialog';
import { Settings as SettingsIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  ButtonGroup,
  DialogProps,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  MenuProps,
  Typography,
} from '@mui/material';
import { AuthRole } from '@prisma/client';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { PropsWithChildren, useRef } from 'react';
import { useBoolean, useTernaryDarkMode } from 'usehooks-ts';
import { IconButtonWithTooltip, IconButtonWithTooltipProps } from '..';

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

export const SettingsIconButton = (
  props: PropsWithChildren<SettingsIconButtonProps>,
) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const anchorRef = useRef<HTMLButtonElement>(null);
  const {
    value: menuVisible,
    setTrue: openMenu,
    setFalse: closeMenu,
  } = useBoolean(false);
  const {
    value: updateLocaleDialogVisible,
    setTrue: openUpdateLocaleDialog,
    setFalse: closeUpdateLocaleDialog,
  } = useBoolean(false);
  const { ternaryDarkMode, setTernaryDarkMode } = useTernaryDarkMode();
  return (
    <>
      <IconButtonWithTooltip
        title={tCommon('Settings')}
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
                primary={tCommon('DarkMode._')}
                primaryTypographyProps={{ color: 'text.secondary' }}
              />
              <ButtonGroup
                size="small"
                onClick={(ev) => ev.stopPropagation()}
                disableElevation
              >
                <Button
                  onClick={() => {
                    setTernaryDarkMode('light');
                  }}
                  variant={
                    ternaryDarkMode === 'light' ? 'contained' : undefined
                  }
                >
                  {tCommon('DarkMode.Off')}
                </Button>
                <Button
                  onClick={() => {
                    setTernaryDarkMode('dark');
                  }}
                  variant={ternaryDarkMode === 'dark' ? 'contained' : undefined}
                >
                  {tCommon('DarkMode.On')}
                </Button>
                <Button
                  onClick={() => {
                    setTernaryDarkMode('system');
                  }}
                  variant={
                    ternaryDarkMode === 'system' ? 'contained' : undefined
                  }
                >
                  {tCommon('DarkMode.Auto')}
                </Button>
              </ButtonGroup>
            </ListItem>
          )}
          {props.enableCommonMenuItems && (
            <MenuItem dense onClick={() => openUpdateLocaleDialog()}>
              <ListItemText
                primary={tCommon('Language._')}
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
                  {tCommon(`Language.${router.locale}`, {
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
        fullWidth
        maxWidth="xs"
        {...props.overrides?.LocaleDialogProps}
      />
      {props.children}
    </>
  );
};

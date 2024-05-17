import { useNotice } from '@/hooks';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogProps,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

type UpdateLocaleDialogProps = DialogProps;

export const UpdateLocaleDialog = (props: UpdateLocaleDialogProps) => {
  const router = useRouter();
  const { showSuccess } = useNotice();
  const { t } = useTranslation();

  const updateLocale = useCallback(
    async (locale: string) => {
      const { pathname, asPath, query } = router;
      await router.push({ pathname, query }, asPath, { locale });
      showSuccess(t('common:Language.Updated'));
    },
    [router, showSuccess, t],
  );

  return (
    <Dialog {...props}>
      <AppBar elevation={0}>
        <Toolbar variant="dense" sx={{ gap: 1 }}>
          <Typography variant="subtitle1">
            {t('common:Language.Update')}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            edge="end"
            onClick={() => {
              props?.onClose?.({}, 'backdropClick');
            }}
            color="inherit"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent dividers>
        <List dense>
          {router.locales?.map((locale) => (
            <ListItemButton
              key={locale}
              selected={locale === router.locale}
              onClick={() => updateLocale(locale)}
            >
              <ListItemText
                primary={t(`common:Language.${locale}`, {
                  defaultValue: locale,
                })}
              />
              {locale === router.locale && (
                <Chip
                  size="small"
                  label={t('common:Language.Activated')}
                  sx={{ borderRadius: 1 }}
                  color="primary"
                  variant="outlined"
                />
              )}
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

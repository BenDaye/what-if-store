import { OverridesDialogProps } from '@/types/overrides';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';
import { ApiKeyDataGrid } from './ApiKeyDataGrid';
import { CreateApiKeyButton } from './CreateApiKeyButton';

type AuthApiKeyDialogProps = OverridesDialogProps;
export const AuthApiKeyDialog = ({
  overrides,
  DialogProps,
}: AuthApiKeyDialogProps) => {
  const { t } = useTranslation();

  const onClose = useCallback(() => {
    DialogProps?.onClose?.({}, 'backdropClick');
  }, [DialogProps]);

  return (
    <Dialog onClose={onClose} {...DialogProps}>
      <AppBar elevation={0} {...overrides?.AppBarProps}>
        <Toolbar variant="dense" sx={{ gap: 1 }}>
          <Typography variant="subtitle1">{t('auth:ApiKey._')}</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton edge="end" onClick={onClose} color="inherit">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ height: 480 }} {...overrides?.DialogContentProps}>
        <ApiKeyDataGrid />
      </DialogContent>
      <DialogActions {...overrides?.DialogActionsProps}>
        <CreateApiKeyButton />
      </DialogActions>
    </Dialog>
  );
};

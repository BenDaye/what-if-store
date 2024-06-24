import { useNotice } from '@/hooks';
import type { UploadFormDataSchema } from '@/server/schemas';
import { uploadFormDataSchema } from '@/server/schemas';
import type { OverridesProps } from '@/types/overrides';
import { zodResolver } from '@hookform/resolvers/zod';
import { Close as CloseIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import type { DialogActionsProps, DialogContentProps, DialogProps } from '@mui/material';
import {
  AppBar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { trpc } from '@what-if-store/server/react/trpc';

type UploadDialogProps = OverridesProps<{
  DialogContentProps?: DialogContentProps;
  DialogActionsProps?: DialogActionsProps;
}> &
  DialogProps;

export const UploadDialog = ({ overrides, ...props }: UploadDialogProps) => {
  const { t } = useTranslation();

  const { showSuccess, showError } = useNotice();
  const {
    trpc: { path },
    mutateAsync: upload,
    isPending,
  } = trpc.protectedDashboardUpload.upload.useMutation({
    onError: (err) => showError(err.message),
    onSuccess: () => showSuccess(t('common:Uploaded')),
  });

  const { handleSubmit, watch, formState, setValue, reset } = useForm<UploadFormDataSchema>({
    mode: 'all',
    defaultValues: {
      name: Date.now().toString(),
    },
    resolver: zodResolver(uploadFormDataSchema, undefined, {
      raw: true,
    }),
  });

  const onSubmit = async (data: UploadFormDataSchema) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('file', data.file);
    await upload(formData)
      .then(() => props?.onClose?.({}, 'backdropClick'))
      .catch(() => null);
  };

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setValue('file', event.target.files[0]);
    }
  };

  const onClose = useCallback(() => {
    props?.onClose?.({}, 'backdropClick');
    reset();
  }, [props, reset]);

  return (
    <Dialog {...props} onClose={() => onClose()}>
      <form
        method="post"
        action={`/api/trpc/${path}`}
        encType="multipart/form-data"
        onSubmit={handleSubmit(onSubmit)}
      >
        <AppBar elevation={0}>
          <Toolbar variant="dense" sx={{ gap: 1 }}>
            <Typography variant="subtitle1">{t('upload:_')}</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton edge="end" onClick={() => onClose()} color="inherit">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent dividers {...overrides?.DialogContentProps}>
          <Box sx={{ position: 'relative' }}>
            <label
              htmlFor="contained-button-file"
              style={{
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                position: 'absolute',
                zIndex: 10,
              }}
            >
              <input
                accept="image/*"
                id="contained-button-file"
                type="file"
                onChange={handleChangeFile}
                style={{ display: 'none' }}
              />
            </label>
            <TextField
              value={watch('file')?.name ?? ''}
              error={!!formState.errors.file}
              helperText={formState.errors.file?.message ?? ' '}
              label={t('upload:File')}
              placeholder={t('upload:File')}
              inputProps={{
                readOnly: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ gap: 1 }} {...overrides?.DialogActionsProps}>
          <Box sx={{ flexGrow: 1 }} />
          <LoadingButton type="submit" loading={isPending}>
            {t('upload:_')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

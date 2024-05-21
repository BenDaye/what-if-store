import type { OverridesProps } from '@/types/overrides';
import { Close as CloseIcon } from '@mui/icons-material';
import type { DialogActionsProps, DialogContentProps, DialogProps } from '@mui/material';
import { AppBar, Box, Dialog, DialogContent, IconButton, Toolbar } from '@mui/material';
import Image from 'next/image';

type PreviewDialogProps = OverridesProps<{
  DialogContentProps?: DialogContentProps;
  DialogActionsProps?: DialogActionsProps;
}> &
  DialogProps & {
    src: string;
  };

export const PreviewDialog = ({ overrides, src, ...props }: PreviewDialogProps) => {
  return (
    <Dialog
      PaperProps={{
        sx: {
          background: 'transparent',
          backdropFilter: 'blur(10px)',
        },
      }}
      {...props}
    >
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar variant="dense" sx={{ gap: 1 }}>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton edge="end" onClick={() => props?.onClose?.({}, 'backdropClick')} color="default">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ position: 'relative' }} {...overrides?.DialogContentProps}>
        <Image alt="preview" src={src} fill style={{ objectFit: 'contain' }} sizes="80vw" unoptimized />
      </DialogContent>
    </Dialog>
  );
};

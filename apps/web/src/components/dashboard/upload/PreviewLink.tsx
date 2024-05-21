import type { OverridesProps } from '@/types/overrides';
import type { LinkProps } from '@mui/material';
import { Link } from '@mui/material';
import { useMemo } from 'react';
import { useBoolean } from 'usehooks-ts';
import { PreviewDialog } from './PreviewDialog';

type PreviewLinkProps = OverridesProps<{
  LinkProps?: LinkProps;
}> & {
  name: string;
  path: string;
};

export const PreviewLink = ({ overrides, path, name }: PreviewLinkProps) => {
  const src = useMemo(() => {
    const prefix = process.env.NEXT_PUBLIC_SERVER_URL;
    return `${prefix}${path}`.replace('/uploads', '');
  }, [path]);

  const {
    value: previewDialogVisible,
    setTrue: openPreviewDialog,
    setFalse: closePreviewDialog,
  } = useBoolean(false);

  return (
    <>
      <Link sx={{ cursor: 'pointer' }} {...overrides?.LinkProps} onClick={() => openPreviewDialog()}>
        {name}
      </Link>
      <PreviewDialog open={previewDialogVisible} onClose={() => closePreviewDialog()} fullScreen src={src} />
    </>
  );
};

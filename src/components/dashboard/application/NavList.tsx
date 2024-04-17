import { IdSchema } from '@/server/schemas';
import {
  Link as CollectionIcon,
  Support as CompatibilityIcon,
  Copyright as CopyrightIcon,
  Favorite as FollowIcon,
  Settings as GeneralIcon,
  ListAlt as GroupIcon,
  PermMedia as MediaIcon,
  CloudDownload as OwnIcon,
  PrivacyTip as PrivacyPolicyIcon,
  Article as ReadmeIcon,
  Gavel as TermsOfUseIcon,
  LocalOffer as VersionIcon,
} from '@mui/icons-material';
import {
  Divider,
  List,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemIconProps,
  ListItemText,
  ListItemTextProps,
  ListProps,
  ListSubheader,
  ListSubheaderProps,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { ReactNode, useCallback, useMemo } from 'react';

export type NavListProps = {
  applicationId: IdSchema;
  overrides?: {
    ListProps?: ListProps;
    ListItemButtonProps?: ListItemButtonProps;
    ListSubheaderProps?: ListSubheaderProps;
  };
  divider?: boolean;
};

export const NavList = ({
  applicationId,
  overrides,
  divider = true,
}: NavListProps) => {
  const { t } = useTranslation();
  return (
    <List dense {...overrides?.ListProps}>
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix=""
        text={t('application:Nav.General')}
        icon={<GeneralIcon />}
        {...overrides?.ListItemButtonProps}
      />
      {divider && <Divider sx={{ mt: 1 }} />}
      <ListSubheader {...overrides?.ListSubheaderProps}>
        {t('application:Nav.Review')}
      </ListSubheader>
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/media"
        text={t('application:Nav.Media')}
        icon={<MediaIcon />}
        {...overrides?.ListItemButtonProps}
      />
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/version"
        text={t('application:Nav.Version')}
        icon={<VersionIcon />}
        {...overrides?.ListItemButtonProps}
      />
      {divider && <Divider sx={{ mt: 1 }} />}
      <ListSubheader {...overrides?.ListSubheaderProps}>
        {t('application:Nav.Declaration')}
      </ListSubheader>
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/compatibility"
        text={t('application:Nav.Compatibility')}
        icon={<CompatibilityIcon />}
        {...overrides?.ListItemButtonProps}
      />
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/privacy_policy"
        text={t('application:Nav.PrivacyPolicy')}
        icon={<PrivacyPolicyIcon />}
        {...overrides?.ListItemButtonProps}
      />
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/terms_of_use"
        text={t('application:Nav.TermsOfUse')}
        icon={<TermsOfUseIcon />}
        {...overrides?.ListItemButtonProps}
      />
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/copyright"
        text={t('application:Nav.Copyright')}
        icon={<CopyrightIcon />}
        {...overrides?.ListItemButtonProps}
      />
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/readme"
        text={t('application:Nav.Readme')}
        icon={<ReadmeIcon />}
        {...overrides?.ListItemButtonProps}
      />
      {divider && <Divider sx={{ mt: 1 }} />}
      <ListSubheader {...overrides?.ListSubheaderProps}>
        {t('application:Nav.Relation')}
      </ListSubheader>
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/follow"
        text={t('application:Nav.Follow')}
        icon={<FollowIcon />}
        {...overrides?.ListItemButtonProps}
      />
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/own"
        text={t('application:Nav.Own')}
        icon={<OwnIcon />}
        {...overrides?.ListItemButtonProps}
      />
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/collection"
        text={t('application:Nav.Collection')}
        icon={<CollectionIcon />}
        {...overrides?.ListItemButtonProps}
      />
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/group"
        text={t('application:Nav.Group')}
        icon={<GroupIcon />}
        {...overrides?.ListItemButtonProps}
      />
      {divider && <Divider sx={{ mt: 1 }} />}
      <ListSubheader {...overrides?.ListSubheaderProps}>
        {t('application:Nav.Stat')}
      </ListSubheader>
    </List>
  );
};

type ApplicationNavListItemButtonProps = {
  applicationId: IdSchema;
  overrides?: {
    ListItemButtonProps?: ListItemButtonProps;
    ListItemIconProps?: ListItemIconProps;
    ListItemTextProps?: ListItemTextProps;
  };
  pathnamePrefix?: string;
  pathnameSuffix?: string;
  pathnameReplacement?: string;
  text: string;
  icon: ReactNode;
};

const ApplicationNavListItemButton = ({
  applicationId,
  pathnamePrefix = '/dashboard/application',
  pathnameReplacement = '[id]',
  pathnameSuffix = '',
  text,
  icon,
  overrides,
}: ApplicationNavListItemButtonProps) => {
  const _pathname = useMemo(
    () => `${pathnamePrefix}/${pathnameReplacement}${pathnameSuffix}`,
    [pathnamePrefix, pathnameReplacement, pathnameSuffix],
  );
  const url = useMemo(
    () => _pathname.replace(pathnameReplacement, applicationId),
    [_pathname, pathnameReplacement, applicationId],
  );

  const { pathname, push } = useRouter();
  const selected = useMemo(() => pathname === _pathname, [pathname, _pathname]);
  const onClick = useCallback(() => {
    push(url);
  }, [url, push]);

  return (
    <ListItemButton
      selected={selected}
      onClick={onClick}
      {...overrides?.ListItemButtonProps}
    >
      <ListItemIcon {...overrides?.ListItemIconProps}>{icon}</ListItemIcon>
      <ListItemText primary={text} {...overrides?.ListItemTextProps} />
    </ListItemButton>
  );
};

import { IdSchema } from '@/server/schemas';
import {
  Link as CollectionIcon,
  Support as CompatibilityIcon,
  Favorite as FollowIcon,
  Settings as GeneralIcon,
  ListAlt as GroupIcon,
  PermMedia as MediaIcon,
  CloudDownload as OwnIcon,
  PrivacyTip as PrivacyPolicyIcon,
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
  const { t: tApplicationNav } = useTranslation('application', {
    keyPrefix: 'Nav',
  });
  return (
    <List dense {...overrides?.ListProps}>
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix=""
        text={tApplicationNav('General', 'General')}
        icon={<GeneralIcon />}
        {...overrides?.ListItemButtonProps}
      />
      {divider && <Divider sx={{ mt: 1 }} />}
      <ListSubheader {...overrides?.ListSubheaderProps}>
        {tApplicationNav('Review', 'Review')}
      </ListSubheader>
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/media"
        text={tApplicationNav('Media', 'Media')}
        icon={<MediaIcon />}
        {...overrides?.ListItemButtonProps}
      />
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/version"
        text={tApplicationNav('Version', 'Version')}
        icon={<VersionIcon />}
        {...overrides?.ListItemButtonProps}
      />
      {divider && <Divider sx={{ mt: 1 }} />}
      <ListSubheader {...overrides?.ListSubheaderProps}>
        {tApplicationNav('Declaration', 'Declaration')}
      </ListSubheader>
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/compatibility"
        text={tApplicationNav('Compatibility', 'Compatibility')}
        icon={<CompatibilityIcon />}
        {...overrides?.ListItemButtonProps}
      />
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/privacy_policy"
        text={tApplicationNav('PrivacyPolicy', 'Privacy Policy')}
        icon={<PrivacyPolicyIcon />}
        {...overrides?.ListItemButtonProps}
      />
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/terms_of_use"
        text={tApplicationNav('TermsOfUse', 'Terms Of Use')}
        icon={<TermsOfUseIcon />}
        {...overrides?.ListItemButtonProps}
      />
      {divider && <Divider sx={{ mt: 1 }} />}
      <ListSubheader {...overrides?.ListSubheaderProps}>
        {tApplicationNav('Relation', 'Relation')}
      </ListSubheader>
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/follow"
        text={tApplicationNav('Follow', 'Follow')}
        icon={<FollowIcon />}
        {...overrides?.ListItemButtonProps}
      />
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/own"
        text={tApplicationNav('Own', 'Own')}
        icon={<OwnIcon />}
        {...overrides?.ListItemButtonProps}
      />
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/collection"
        text={tApplicationNav('Collection', 'Collection')}
        icon={<CollectionIcon />}
        {...overrides?.ListItemButtonProps}
      />
      <ApplicationNavListItemButton
        applicationId={applicationId}
        pathnameSuffix="/group"
        text={tApplicationNav('Group', 'Group')}
        icon={<GroupIcon />}
        {...overrides?.ListItemButtonProps}
      />
      {divider && <Divider sx={{ mt: 1 }} />}
      <ListSubheader {...overrides?.ListSubheaderProps}>
        {tApplicationNav('Stat', 'Stat')} (TODO)
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

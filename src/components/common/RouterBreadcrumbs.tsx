import { OverridesProps } from '@/types/overrides';
import { toPascalCase } from '@/utils/formatter';
import { Breadcrumbs, BreadcrumbsProps, Link, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export type RouterBreadcrumbsProps = OverridesProps<{
  BreadcrumbsProps?: BreadcrumbsProps;
}> & {
  label?: string;
};

export const RouterBreadcrumbs = ({
  overrides,
  label,
}: RouterBreadcrumbsProps) => {
  const { pathname, asPath } = useRouter();
  const asPathArray = useMemo(() => asPath.split('/').slice(1), [asPath]);
  const pathnameArray = useMemo(() => pathname.split('/').slice(1), [pathname]);
  const { t: tRouter } = useTranslation('router');
  return (
    <Breadcrumbs {...overrides?.BreadcrumbsProps}>
      {asPathArray.map((route, index, self) => {
        const isDynamic = route !== pathnameArray[index];
        const last = index === self.length - 1;
        const href = last
          ? undefined
          : `/${self.slice(0, index + 1).join('/')}`;
        const text =
          index === 0
            ? `${toPascalCase(route)}._`
            : self
                .slice(0, index + 1)
                .map((r) => toPascalCase(r))
                .join('.');
        if (last) {
          return (
            <Typography key={route} color="text.primary" variant="subtitle2">
              {label ? label : isDynamic ? route : tRouter(text)}
            </Typography>
          );
        }
        return (
          <Link key={route} color="inherit" href={href} variant="subtitle2">
            {isDynamic ? route : tRouter(text)}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

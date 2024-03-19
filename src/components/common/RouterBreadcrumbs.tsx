import { toPascalCase } from '@/utils/formatter';
import { Breadcrumbs, BreadcrumbsProps, Link, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export type RouterBreadcrumbsProps = {
  overrides?: { BreadcrumbsProps?: BreadcrumbsProps };
  lastText?: string;
};

export const RouterBreadcrumbs = ({
  overrides,
  lastText,
}: RouterBreadcrumbsProps) => {
  const { pathname } = useRouter();
  const routes = useMemo(() => pathname.split('/').slice(1), [pathname]);
  const { t: tRouter } = useTranslation('router');
  return (
    <Breadcrumbs {...overrides?.BreadcrumbsProps}>
      {routes.map((route, index) => {
        const last = index === routes.length - 1;
        const href = last
          ? undefined
          : `/${routes.slice(0, index + 1).join('/')}`;
        const text =
          index === 0
            ? tRouter(`${toPascalCase(route)}._`)
            : tRouter(
                routes
                  .slice(0, index + 1)
                  .map((r) => toPascalCase(r))
                  .join('.'),
              );
        if (last) {
          return (
            <Typography key={route} color="text.primary" variant="subtitle2">
              {lastText ?? text}
            </Typography>
          );
        }
        return (
          <Link
            key={route}
            underline="hover"
            color="inherit"
            href={href}
            variant="subtitle2"
          >
            {text}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

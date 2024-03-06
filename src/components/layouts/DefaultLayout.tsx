import { useHeadMeta } from '@/hooks';
import { Container } from '@mui/material';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { PropsWithChildren, ReactElement } from 'react';

export const DefaultLayout = ({
  children,
}: PropsWithChildren): ReactElement<PropsWithChildren> => {
  const { t: tMeta } = useTranslation('meta');
  const { title, description } = useHeadMeta('Default');
  return (
    <>
      <Head key="default-layout">
        <title>
          {tMeta('App Title', {
            defaultValue: title ?? 'App Title',
          })}
        </title>
        <meta
          name="description"
          content={tMeta('App Description', description ?? 'App Description')}
        />
      </Head>
      <Container
        disableGutters
        sx={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}
      >
        {children}
      </Container>
    </>
  );
};

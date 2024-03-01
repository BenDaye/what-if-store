import { Container } from '@mui/material';
import Head from 'next/head';
import { PropsWithChildren, ReactElement } from 'react';

export const DefaultLayout = ({
  children,
}: PropsWithChildren): ReactElement<PropsWithChildren> => {
  return (
    <>
      <Head key="default-layout">
        <title>Default Title</title>
        <meta name="description" content="Default Description" />
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

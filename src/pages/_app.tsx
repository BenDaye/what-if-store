import '@/theme/global.css';
import '@fontsource/roboto-mono/300.css';
import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/500.css';
import '@fontsource/roboto-mono/700.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'overlayscrollbars/overlayscrollbars.css';

import { DefaultLayout } from '@/components/layouts';
import { AuthProvider, TernaryDarkModeProvider } from '@/hooks';
import { NoticeProvider } from '@/hooks/notice';
import { CreateContextOptions } from '@/server/context';
import { createEmotionCache } from '@/theme';
import { trpc } from '@/utils/trpc';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NextPage } from 'next';
import { SessionProvider, getSession } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import type { AppProps, AppType } from 'next/app';
import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import { ReactElement, ReactNode } from 'react';
import { SWRConfig } from 'swr';
import nextI18NextConfig from '../../next-i18next.config.js';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<TProps = {}, TInitialProps = TProps> = NextPage<
  TProps,
  TInitialProps
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export interface MyAppProps extends AppProps {
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  pageProps: AppProps['pageProps'] & CreateContextOptions;
}

const MyApp: AppType<CreateContextOptions> = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: MyAppProps) => {
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return (
    <CacheProvider value={emotionCache}>
      <Head key="default">
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <TernaryDarkModeProvider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools
            initialIsOpen={false}
            position="bottom"
            buttonPosition="bottom-right"
          />
        )}
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={3000}
          disableWindowBlurListener
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <NoticeProvider>
            <SessionProvider session={pageProps?.session}>
              <SWRConfig
                value={{
                  fetcher: (resource, init) =>
                    fetch(resource, init).then((res) => res.json()),
                }}
              >
                <AuthProvider
                  disableSignIn={Boolean(
                    process.env.NEXT_PUBLIC_DISABLE_SIGN_IN,
                  )}
                  disableSignUp={Boolean(
                    process.env.NEXT_PUBLIC_DISABLE_SIGN_UP,
                  )}
                >
                  {getLayout(<Component {...pageProps} />)}
                </AuthProvider>
              </SWRConfig>
            </SessionProvider>
          </NoticeProvider>
        </SnackbarProvider>
      </TernaryDarkModeProvider>
    </CacheProvider>
  );
};

MyApp.getInitialProps = async ({ ctx }) => ({ session: await getSession(ctx) });

export default trpc.withTRPC(appWithTranslation(MyApp, nextI18NextConfig));

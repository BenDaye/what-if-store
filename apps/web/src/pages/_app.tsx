import '@/components/common/BlockNote/styles.css';
import '@/components/common/lexical/themes/PlaygroundEditorTheme.css';
import { DefaultLayout } from '@/components/layouts';
import { AuthProvider, BridgeProvider, NoticeProvider, TernaryDarkModeProvider } from '@/hooks';
import { createEmotionCache } from '@/theme';
import '@/theme/global.css';
import type { EmotionCache } from '@emotion/react';
import { CacheProvider } from '@emotion/react';
import '@fontsource/roboto-mono/300.css';
import '@fontsource/roboto-mono/400.css';
import '@fontsource/roboto-mono/500.css';
import '@fontsource/roboto-mono/700.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline } from '@mui/material';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { NextPage } from 'next';
import { getSession, SessionProvider } from 'next-auth/react';
import { appWithTranslation } from 'next-i18next';
import type { AppProps, AppType } from 'next/app';
import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import { trpc } from '@what-if-store/server/react/trpc';
import type { CreateContextOptions } from '@what-if-store/server/server/context';
import 'overlayscrollbars/overlayscrollbars.css';
import type { ReactElement, ReactNode } from 'react';
import { SWRConfig } from 'swr';
import nextI18NextConfig from '../../next-i18next.config.js';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<TProps = {}, TInitialProps = TProps> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export interface MyAppProps extends AppProps {
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;

  pageProps: AppProps['pageProps'] & CreateContextOptions;
}

const MyApp: AppType<CreateContextOptions> = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: MyAppProps) => {
  const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return (
    <CacheProvider value={emotionCache}>
      <Head key="default">
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <TernaryDarkModeProvider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} position="bottom" buttonPosition="bottom-right" />
        )}
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={3000}
          disableWindowBlurListener
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <NoticeProvider>
            <BridgeProvider>
              <SessionProvider session={pageProps?.session}>
                <SWRConfig
                  value={{
                    fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
                  }}
                >
                  <AuthProvider
                    disableSignIn={Boolean(process.env.NEXT_PUBLIC_DISABLE_SIGN_IN)}
                    disableSignUp={Boolean(process.env.NEXT_PUBLIC_DISABLE_SIGN_UP)}
                  >
                    {getLayout(<Component {...pageProps} />)}
                  </AuthProvider>
                </SWRConfig>
              </SessionProvider>
            </BridgeProvider>
          </NoticeProvider>
        </SnackbarProvider>
      </TernaryDarkModeProvider>
    </CacheProvider>
  );
};

MyApp.getInitialProps = async ({ ctx }) => ({ session: await getSession(ctx) });

export default trpc.withTRPC(appWithTranslation(MyApp, nextI18NextConfig));

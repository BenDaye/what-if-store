import nextI18NextConfig from '@/../next-i18next.config';
import { NextPageWithLayout } from '@/pages/_app';
import { prisma, redis } from '@/server/modules';
import { appRouter } from '@/server/routers/_app';
import { Box, Divider, Link, Typography } from '@mui/material';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import SuperJSON from 'superjson';
import { useCountdown } from 'usehooks-ts';

const Page: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = () => {
  const { back } = useRouter();
  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 3,
  });

  useEffect(() => {
    startCountdown();

    return () => {
      resetCountdown();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (count < 1) back();
  }, [count, back]);

  return (
    <Box
      sx={{
        height: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.disabled',
        }}
      >
        <Typography variant="h1">404</Typography>
        <Divider
          flexItem
          orientation="vertical"
          variant="middle"
          sx={{ mx: 2 }}
        />
        <Box>
          <Typography variant="h4" paragraph>
            Page Not Found
          </Typography>
          <Link
            onClick={() => back()}
            underline="hover"
            variant="h6"
            sx={{ cursor: 'pointer' }}
          >
            Go Back {count > 0 ? `(${count})` : null}
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      session: null,
      redis,
      prisma,
    },
    transformer: SuperJSON,
  });

  await helpers.publicAppMeta.get.prefetch();

  return {
    props: {
      ...(await serverSideTranslations(
        context.locale ?? 'en-US',
        undefined,
        nextI18NextConfig,
      )),
      trpcState: helpers.dehydrate(),
    },
    revalidate: 10,
  };
};
export default Page;

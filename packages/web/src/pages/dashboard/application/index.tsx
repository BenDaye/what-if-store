import nextI18NextConfig from '@/../next-i18next.config';
import { PageContainer, RouterBreadcrumbs } from '@/components/common';
import {
  ApplicationCollectionDataGrid,
  ApplicationDataGrid,
  ApplicationGroupDataGrid,
  ApplicationTagDataGrid,
} from '@/components/dashboard';
import { DashboardLayout } from '@/components/layouts';
import { NextPageWithLayout } from '@/pages/_app';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma, redis } from '@/server/modules';
import { appRouter } from '@/server/routers/_app';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { ApplicationCategory } from '@prisma/client';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SuperJSON from 'superjson';

const Page: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  return (
    <PageContainer
      hasHeader
      header={
        <>
          <RouterBreadcrumbs />
        </>
      }
    >
      <Grid container spacing={2}>
        <Grid xs={12} md={6} xl={9}>
          <ApplicationDataGrid
            overrides={{
              CardContentProps: {
                sx: { height: 600 },
              },
            }}
          />
        </Grid>
        <Grid xs={12} md={6} xl={3}>
          <ApplicationTagDataGrid
            overrides={{
              CardContentProps: {
                sx: { height: 600 },
              },
            }}
          />
        </Grid>
        <Grid xs={12} md={6} xl={6}>
          <ApplicationGroupDataGrid
            overrides={{
              CardContentProps: {
                sx: { height: 600 },
              },
            }}
          />
        </Grid>
        <Grid xs={12} md={6} xl={6}>
          <ApplicationCollectionDataGrid
            overrides={{
              CardContentProps: {
                sx: { height: 600 },
              },
            }}
          />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// NOTE: 如果trpc开启了ssr，那下面这个方法将无法正确的返回数据 (https://trpc.io/docs/client/nextjs/ssr)
export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      session,
      redis,
      prisma,
    },
    transformer: SuperJSON,
  });

  await helpers.publicDashboardMeta.get.prefetch();

  await Promise.all([
    ...Object.values(ApplicationCategory).map((item) =>
      helpers.protectedDashboardApplication.list.prefetchInfinite({
        limit: 20,
        category: [item],
      }),
    ),
    helpers.protectedDashboardApplication.list.prefetch({ limit: 20 }),
  ]);

  return {
    props: {
      ...(await serverSideTranslations(
        context.locale ?? 'en-US',
        undefined,
        nextI18NextConfig,
      )),
      trpcState: helpers.dehydrate(),
    },
  };
};

export default Page;

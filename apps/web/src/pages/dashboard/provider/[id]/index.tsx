import nextI18NextConfig from '@/../next-i18next.config';
import { PageContainer } from '@/components/common';
import { ProviderProfileCard, ProviderTypeChip } from '@/components/dashboard';
import { DashboardLayout } from '@/components/layouts';
import { useDashboardProvider } from '@/hooks';
import type { NextPageWithLayout } from '@/pages/_app';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma, redis } from '@/server/modules';
import { appRouter } from '@/server/routers/_app';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { ProviderType } from '@prisma/client';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SuperJSON from 'superjson';
import { createServerSideHelpers } from '@trpc/react-query/server';

const Page: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ id }) => {
  const { data, name, type } = useDashboardProvider(id);

  return (
    <PageContainer
      hasHeader
      header={
        <>
          <ProviderTypeChip type={type} />
          <Typography variant="subtitle1">{name}</Typography>
        </>
      }
    >
      <Grid container spacing={2}>
        <Grid xs={12} md={6} xl>
          <ProviderProfileCard data={data} />
        </Grid>
        <Grid xs={12} md={6} xl>
          <ProviderProfileCard data={data} />
        </Grid>
        <Grid xs={12} xl={6}>
          <ProviderProfileCard data={data} />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// NOTE: 如果trpc开启了ssr，那下面这个方法将无法正确的返回数据 (https://trpc.io/docs/client/nextjs/ssr)
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
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

  await Promise.all(
    Object.values(ProviderType).map((item) =>
      helpers.protectedDashboardProvider.list.prefetchInfinite({
        limit: 20,
        type: [item],
      }),
    ),
  );

  const id = context.params?.id as string;
  if (id) await helpers.protectedDashboardProvider.getById.prefetch(id);

  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en-US', undefined, nextI18NextConfig)),
      id,
      trpcState: helpers.dehydrate(),
    },
  };
};

export default Page;

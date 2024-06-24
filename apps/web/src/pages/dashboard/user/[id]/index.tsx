import nextI18NextConfig from '@/../next-i18next.config';
import { AuthRoleChip, PageContainer } from '@/components/common';
import { UserProfileCard } from '@/components/dashboard';
import { DashboardLayout } from '@/components/layouts';
import { useDashboardUser } from '@/hooks';
import type { NextPageWithLayout } from '@/pages/_app';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SuperJSON from 'superjson';
import { AuthRole } from '@what-if-store/prisma/client';
import { prisma, redis } from '@what-if-store/server/server/modules';
import { appRouter } from '@what-if-store/server/server/routers/_app';
import { createServerSideHelpers } from '@trpc/react-query/server';

const Page: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ id }) => {
  const { data } = useDashboardUser(id);

  return (
    <PageContainer
      hasHeader
      header={
        <>
          <AuthRoleChip role={data.role} />
          <Typography variant="subtitle1">{data.username}</Typography>
        </>
      }
    >
      <Grid container spacing={2}>
        <Grid xs={12} md={6} xl>
          <UserProfileCard data={data} />
        </Grid>
        <Grid xs={12} md={6} xl>
          <UserProfileCard data={data} />
        </Grid>
        <Grid xs={12} xl={6}>
          <UserProfileCard data={data} />
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
    Object.values(AuthRole).map((item) =>
      helpers.protectedDashboardUser.list.prefetchInfinite({
        limit: 20,
        role: [item],
      }),
    ),
  );

  const id = context.params?.id as string;
  if (id) await helpers.protectedDashboardUser.getById.prefetch(id);

  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en-US', undefined, nextI18NextConfig)),
      id,
      trpcState: helpers.dehydrate(),
    },
  };
};

export default Page;

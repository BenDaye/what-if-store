import nextI18NextConfig from '@/../next-i18next.config';
import { PageContainer } from '@/components/common';
import { AuthRoleChip, UserProfileCard } from '@/components/dashboard';
import { DashboardLayout } from '@/components/layouts';
import { useDashboardUser } from '@/hooks';
import { NextPageWithLayout } from '@/pages/_app';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma, redis } from '@/server/modules';
import { appRouter } from '@/server/routers/_app';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { AuthRole } from '@prisma/client';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SuperJSON from 'superjson';

const Page: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
  const { data, username, role } = useDashboardUser(id);

  return (
    <PageContainer
      hasHeader
      header={
        <>
          <AuthRoleChip role={role} />
          <Typography variant="subtitle1">{username}</Typography>
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

  await helpers.protectedDashboardUser.list.prefetchInfinite({
    limit: 20,
    role: [AuthRole.USER],
  });
  await helpers.protectedDashboardUser.list.prefetchInfinite({
    limit: 20,
    role: [AuthRole.AUTHOR],
  });
  await helpers.protectedDashboardUser.list.prefetchInfinite({
    limit: 20,
    role: [AuthRole.ADMIN],
  });

  const id = context.params?.id as string;
  if (id) await helpers.protectedDashboardUser.getProfileById.prefetch(id);

  return {
    props: {
      ...(await serverSideTranslations(
        context.locale ?? 'zh',
        undefined,
        nextI18NextConfig,
      )),
      id,
      trpcState: helpers.dehydrate(),
    },
  };
};

export default Page;

import nextI18NextConfig from '@/../next-i18next.config';
import { PageContainer, RouterBreadcrumbs } from '@/components/common';
import { UploadListSectionCard } from '@/components/dashboard';
import { DashboardLayout } from '@/components/layouts';
import { NextPageWithLayout } from '@/pages/_app';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma, redis } from '@/server/modules';
import { appRouter } from '@/server/routers/_app';
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
      <UploadListSectionCard />
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
    helpers.protectedDashboardUpload.list.prefetch({ limit: 20 }),
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

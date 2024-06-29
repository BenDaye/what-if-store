import nextI18NextConfig from '@/../next-i18next.config';
import { PageContainer, RouterBreadcrumbs } from '@/components/common';
import {
  Page as ApplicationPage,
  DangerZoneSectionCard,
  ExtraSectionCard,
  GeneralSectionCard,
  UserSectionCard,
} from '@/components/dashboard';
import { DashboardLayout } from '@/components/layouts';
import { useDashboardApplication } from '@/hooks';
import type { NextPageWithLayout } from '@/pages/_app';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Container } from '@mui/material';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SuperJSON from 'superjson';
import { ApplicationCategory } from '@what-if-store/prisma/client';
import { createServerSideHelpers } from '@what-if-store/server/react';
import { prisma, redis } from '@what-if-store/server/server/modules';
import { appRouter } from '@what-if-store/server/server/routers/_app';
import type { IdSchema } from '@what-if-store/server/server/schemas';

const Page: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ id }) => {
  const { data } = useDashboardApplication(id);
  return (
    <PageContainer
      hasHeader
      header={
        <>
          <RouterBreadcrumbs />
        </>
      }
    >
      <Container>
        <ApplicationPage applicationId={id}>
          <GeneralSectionCard defaultValues={data} />
          <ExtraSectionCard defaultValues={data} />
          <UserSectionCard defaultValues={data} />
          <DangerZoneSectionCard defaultValues={data} />
        </ApplicationPage>
      </Container>
    </PageContainer>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// NOTE: 如果trpc开启了ssr，那下面这个方法将无法正确的返回数据 (https://trpc.io/docs/client/nextjs/ssr)
export const getServerSideProps = async (context: GetServerSidePropsContext<{ id: IdSchema }>) => {
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
    helpers.protectedDashboardApplication.list.prefetchInfinite({ limit: 20 }),
  ]);

  const id = context.params!.id;
  if (id) await helpers.protectedDashboardApplication.getById.prefetch(id);

  await helpers.protectedDashboardApplicationTag.list.prefetchInfinite({
    limit: 20,
  });

  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en-US', undefined, nextI18NextConfig)),
      trpcState: helpers.dehydrate(),
      id,
    },
  };
};

export default Page;

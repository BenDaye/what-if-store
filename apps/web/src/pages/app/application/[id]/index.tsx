import nextI18NextConfig from '@/../next-i18next.config';
import { ApplicationPage } from '@/components/app';
import { PageContainer } from '@/components/common';
import { AppLayout } from '@/components/layouts';
import type { NextPageWithLayout } from '@/pages/_app';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SuperJSON from 'superjson';
import { createServerSideHelpers } from '@what-if-store/server/react';
import { prisma, redis } from '@what-if-store/server/server/modules';
import { appRouter } from '@what-if-store/server/server/routers/_app';
import type { IdSchema } from '@what-if-store/server/server/schemas';

const Page: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ id }) => {
  return (
    <PageContainer>
      <ApplicationPage applicationId={id} />
    </PageContainer>
  );
};

Page.getLayout = (page) => <AppLayout>{page}</AppLayout>;

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

  await helpers.publicAppMeta.get.prefetch();

  const id = context.params!.id;
  if (id) await helpers.publicAppApplication.getById.prefetch(id);

  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en-US', undefined, nextI18NextConfig)),
      trpcState: helpers.dehydrate(),
      id,
    },
  };
};

export default Page;

import nextI18NextConfig from '@/../next-i18next.config';
import { PermanentSectionCard, PersistentSectionCard } from '@/components/app';
import { PageContainer } from '@/components/common';
import { AppLayout } from '@/components/layouts';
import { useAppApplicationGroups } from '@/hooks';
import { NextPageWithLayout } from '@/pages/_app';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma, redis } from '@/server/modules';
import { appRouter } from '@/server/routers/_app';
import { ApplicationCategory, ApplicationGroupType } from '@prisma/client';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SuperJSON from 'superjson';

const Page: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  const { data: permanent } = useAppApplicationGroups({
    type: ApplicationGroupType.Permanent,
  });
  const { data: persistent } = useAppApplicationGroups({
    type: ApplicationGroupType.Persistent,
  });
  return (
    <PageContainer>
      <PermanentSectionCard data={permanent} />
      <PersistentSectionCard data={persistent} />
    </PageContainer>
  );
};

Page.getLayout = (page) => <AppLayout>{page}</AppLayout>;

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

  await helpers.publicAppMeta.get.prefetch();
  await Promise.all([
    ...Object.values(ApplicationCategory).map((item) =>
      helpers.publicAppApplication.list.prefetchInfinite({
        limit: 20,
        category: [item],
      }),
    ),
    ...Object.values(ApplicationGroupType).map((item) =>
      helpers.publicAppApplicationGroup.list.prefetchInfinite({
        limit: 20,
        type: item,
      }),
    ),
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

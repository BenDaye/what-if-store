import nextI18NextConfig from '@/../next-i18next.config';
import { ApplicationFilter, CategorySectionCard } from '@/components/app';
import { PageContainer } from '@/components/common';
import { AppLayout } from '@/components/layouts';
import { useAppApplications } from '@/hooks';
import type { NextPageWithLayout } from '@/pages/_app';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Stack } from '@mui/material';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';
import SuperJSON from 'superjson';
import { useDebounceValue } from 'usehooks-ts';
import { ApplicationCategory, ApplicationPlatform } from '@what-if-store/prisma/client';
import { prisma, redis } from '@what-if-store/server/server/modules';
import { appRouter } from '@what-if-store/server/server/routers/_app';
import type { ApplicationListInputSchema } from '@what-if-store/server/server/schemas';
import { createServerSideHelpers } from '@trpc/react-query/server';

const Page: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  const [input, setInput] = useState<ApplicationListInputSchema>({
    category: Object.values(ApplicationCategory),
    platforms: Object.values(ApplicationPlatform),
    locales: [],
    countries: [],
    ageRating: undefined,
  });
  const [debounceInput, setDebounceInput] = useDebounceValue(input, 100);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setDebounceInput(input), [input]);
  const { data } = useAppApplications(debounceInput);
  return (
    <>
      <ApplicationFilter input={input} setInput={setInput} />
      <PageContainer>
        <Stack gap={1}>
          <CategorySectionCard data={data} input={input} />
        </Stack>
      </PageContainer>
    </>
  );
};

Page.getLayout = (page) => <AppLayout hasSecondaryDrawer>{page}</AppLayout>;

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

  await helpers.publicAppMeta.get.prefetch();
  await Promise.all([
    ...Object.values(ApplicationCategory).map((item) =>
      helpers.publicAppApplication.list.prefetchInfinite({
        limit: 20,
        category: [item],
      }),
    ),
  ]);

  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en-US', undefined, nextI18NextConfig)),
      trpcState: helpers.dehydrate(),
    },
  };
};

export default Page;

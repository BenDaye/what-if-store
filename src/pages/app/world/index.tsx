import nextI18NextConfig from '@/../next-i18next.config';
import { AppLayout } from '@/components/layouts';
import { NextPageWithLayout } from '@/pages/_app';
import { prisma, redis } from '@/server/modules';
import { appRouter } from '@/server/routers/_app';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SuperJSON from 'superjson';

const Page: NextPageWithLayout<
  InferGetStaticPropsType<typeof getStaticProps>
> = () => {
  return <>World Page</>;
};

Page.getLayout = (page) => <AppLayout>{page}</AppLayout>;

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
        context.locale ?? 'zh',
        undefined,
        nextI18NextConfig,
      )),
      trpcState: helpers.dehydrate(),
    },
    revalidate: 10,
  };
};

// NOTE: 如果trpc开启了ssr，那下面这个方法将无法正确的返回数据 (https://trpc.io/docs/client/nextjs/ssr)
// export const getServerSideProps = async (
//   context: GetServerSidePropsContext,
// ) => {
//   const session = await getServerSession(context.req, context.res, authOptions);
//   const helpers = createServerSideHelpers({
//     router: appRouter,
//     ctx: {
//       session,
//       redis,
//       prisma,
//     },
//     transformer: SuperJSON,
//   });

//   await helpers.publicAppMeta.get.prefetch();

//   return {
//     props: {
//       ...(await serverSideTranslations(
//         context.locale ?? 'zh',
//         undefined,
//         nextI18NextConfig,
//       )),
//       trpcState: helpers.dehydrate(),
//     },
//   };
// };

export default Page;

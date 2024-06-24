import nextI18NextConfig from '@/../next-i18next.config';
import { SignUpDialog } from '@/components/common';
import { DefaultLayout } from '@/components/layouts';
import type { NextPageWithLayout } from '@/pages/_app';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import SuperJSON from 'superjson';
import { prisma, redis } from '@what-if-store/server/server/modules';
import { appRouter } from '@what-if-store/server/server/routers/_app';
import { createServerSideHelpers } from '@trpc/react-query/server';

const Page: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  disableSignIn,
  disableSignUp,
}) => {
  const { back } = useRouter();
  return (
    <>
      <SignUpDialog
        DialogProps={{
          open: true,
          onClose: () => back(),
        }}
        disableSignIn={disableSignIn}
        disableSignUp={disableSignUp}
      />
    </>
  );
};

Page.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

// NOTE: 如果trpc开启了ssr，那下面这个方法将无法正确的返回数据 (https://trpc.io/docs/client/nextjs/ssr)
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const disableSignIn = Boolean(process.env.NEXT_PUBLIC_DISABLE_SIGN_IN);
  const disableSignUp = Boolean(process.env.NEXT_PUBLIC_DISABLE_SIGN_UP);

  if (disableSignUp) {
    return {
      redirect: {
        destination: '/app',
        permanent: false,
      },
    };
  }

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

  return {
    props: {
      ...(await serverSideTranslations(context.locale ?? 'en-US', undefined, nextI18NextConfig)),
      trpcState: helpers.dehydrate(),
      disableSignIn,
      disableSignUp,
    },
  };
};

export default Page;

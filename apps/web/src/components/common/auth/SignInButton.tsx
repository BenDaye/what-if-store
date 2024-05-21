import { useAuth } from '@/hooks';
import type { ButtonProps } from '@mui/material';
import { Button } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

type SignInButtonProps = ButtonProps;

export const SignInButton = (props: SignInButtonProps) => {
  const { status } = useSession();
  const { t } = useTranslation();
  const { signIn } = useAuth();

  return (
    <Button disabled={status === 'authenticated'} onClick={() => signIn()} {...props}>
      {props?.children ?? t('auth:SignIn._')}
    </Button>
  );
};

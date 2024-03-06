import { useAuth } from '@/hooks';
import { Button, ButtonProps } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

type SignInButtonProps = ButtonProps;

export const SignInButton = (props: SignInButtonProps) => {
  const { status } = useSession();
  const { t: tAuth } = useTranslation('auth');
  const { signIn } = useAuth();

  return (
    <Button
      disabled={status === 'authenticated'}
      onClick={() => signIn()}
      {...props}
    >
      {props?.children ?? tAuth('SignIn._')}
    </Button>
  );
};

import { useAuth } from '@/hooks';
import { Button, ButtonProps } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';

type SignUpButtonProps = ButtonProps;

export const SignUpButton = (props: SignUpButtonProps) => {
  const { status } = useSession();
  const { t: tAuth } = useTranslation('auth');
  const { signUp } = useAuth();

  return (
    <Button
      disabled={status === 'authenticated'}
      onClick={() => signUp()}
      {...props}
    >
      {props?.children ?? tAuth('SignUp._')}
    </Button>
  );
};

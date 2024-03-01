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
    <>
      <Button
        {...props}
        disabled={props?.disabled || status === 'authenticated'}
        onClick={(ev) => {
          props.onClick?.(ev);
          signIn();
        }}
      >
        {tAuth('SignIn._')}
      </Button>
    </>
  );
};

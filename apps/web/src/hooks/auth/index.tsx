import { SignInDialog, SignUpDialog } from '@/components/common/auth';
import { NOOP, NOOPAsync } from '@/utils/noop';
import { signOut as signOutNextAuth, useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext } from 'react';
import { useBoolean } from 'usehooks-ts';
import { resetTRPCClient } from '@what-if-store/server/react/trpc';
import { useNotice } from '../notice';

export interface AuthProps {
  disableSignIn?: boolean;
  disableSignUp?: boolean;
}

interface AuthProviderProps {
  signIn: () => void;
  signUp: () => void;
  signOut: () => PromiseLike<void>;
}

const AuthProviderContext = createContext<AuthProviderProps>({
  signIn: NOOP,
  signUp: NOOP,
  signOut: NOOPAsync,
});

export const useAuth = () => useContext(AuthProviderContext);

export const AuthProvider = ({
  children,
  disableSignIn = true,
  disableSignUp = true,
}: PropsWithChildren<AuthProps>) => {
  const { push } = useRouter();
  const { update: updateSession } = useSession();
  const { showError, showSuccess, showWarning } = useNotice();
  const { t } = useTranslation();
  const signOut = async () => {
    try {
      await signOutNextAuth({ redirect: false });
      await updateSession();
      resetTRPCClient();
      showSuccess(t('auth:SignOut.Succeeded'), {
        autoHideDuration: 1000,
        onClose: () => push('/app'),
      });
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
      console.error(error);
    }
  };

  const { value: signInDialog, setFalse: closeSignInDialog, setTrue: openSignInDialog } = useBoolean(false);
  const { value: signUpDialog, setFalse: closeSignUpDialog, setTrue: openSignUpDialog } = useBoolean(false);

  const signIn = useCallback(() => {
    if (disableSignIn) return showWarning(t('auth:SignIn.Disabled'));
    closeSignUpDialog();
    openSignInDialog();
  }, [closeSignUpDialog, disableSignIn, openSignInDialog, showWarning, t]);

  const signUp = useCallback(() => {
    if (disableSignUp) return showWarning(t('auth:SignUp.Disabled'));
    closeSignInDialog();
    openSignUpDialog();
  }, [closeSignInDialog, disableSignUp, openSignUpDialog, showWarning, t]);

  return (
    <AuthProviderContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
      <SignInDialog
        DialogProps={{
          open: signInDialog && !disableSignIn,
          onClose: closeSignInDialog,
        }}
        disableSignIn={disableSignIn}
        disableSignUp={disableSignUp}
      />
      <SignUpDialog
        DialogProps={{
          open: signUpDialog && !disableSignUp,
          onClose: closeSignUpDialog,
        }}
        disableSignIn={disableSignIn}
        disableSignUp={disableSignUp}
      />
    </AuthProviderContext.Provider>
  );
};

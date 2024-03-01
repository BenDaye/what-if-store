import { SignInDialog, SignUpDialog } from '@/components/common/auth';
import { NOOP, NOOPAsync } from '@/utils/noop';
import { AuthRole } from '@prisma/client';
import { signOut as signOutNextAuth } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { PropsWithChildren, createContext, useContext } from 'react';
import { useBoolean } from 'usehooks-ts';
import { useNotice } from '../notice';

export interface AuthProps {
  role?: AuthRole;
  enableSignIn?: boolean;
  enableSignUp?: boolean;
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
  role = AuthRole.USER,
  enableSignIn = true,
  enableSignUp = true,
}: PropsWithChildren<AuthProps>) => {
  const { showError, showSuccess } = useNotice();
  const { t } = useTranslation('auth');
  const signOut = async () => {
    try {
      await signOutNextAuth({ redirect: false });
      showSuccess(t('SignOut.Succeeded'), {
        autoHideDuration: 1000,
        onClose: () => {
          if (typeof window !== 'undefined') window.location.reload();
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        showError(error.message);
      }
      console.error(error);
    }
  };
  const {
    value: signInDialog,
    setFalse: closeSignInDialog,
    setTrue: openSignInDialog,
  } = useBoolean(false);
  const {
    value: signUpDialog,
    setFalse: closeSignUpDialog,
    setTrue: openSignUpDialog,
  } = useBoolean(false);

  const signIn = () => {
    closeSignUpDialog();
    openSignInDialog();
  };

  const signUp = () => {
    closeSignInDialog();
    openSignUpDialog();
  };
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
        open={signInDialog}
        onClose={() => closeSignInDialog()}
        fullWidth
        maxWidth="xs"
        disableEscapeKeyDown
        role={role}
        enableSignIn={enableSignIn}
        enableSignUp={enableSignUp}
      />
      <SignUpDialog
        open={signUpDialog}
        onClose={() => closeSignUpDialog()}
        fullWidth
        maxWidth="xs"
        disableEscapeKeyDown
        role={role}
        enableSignIn={enableSignIn}
        enableSignUp={enableSignUp}
      />
    </AuthProviderContext.Provider>
  );
};

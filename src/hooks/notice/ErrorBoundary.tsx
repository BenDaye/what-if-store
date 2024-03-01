import { OptionsObject, SnackbarKey } from 'notistack';
import { Component, ErrorInfo, ReactNode } from 'react';

type ErrorBoundaryState = {
  hasError: boolean;
};

type ErrorBoundaryProps = {
  showError: (
    message: string,
    options?: OptionsObject | undefined,
  ) => SnackbarKey;
  children: ReactNode;
};

export class MainErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // TODO: log error to Sentry
    console.error(errorInfo);
    this.props.showError(error?.message);
  }

  render(): ReactNode {
    return this.props.children;
  }
}

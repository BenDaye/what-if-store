import type { OptionsObject, SnackbarKey } from 'notistack';
import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

type ErrorBoundaryState = {
  hasError: boolean;
};

type ErrorBoundaryProps = {
  showError: (message: string, options?: OptionsObject | undefined) => SnackbarKey;
  children: ReactNode;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = { hasError: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // TODO: log error to Sentry
    console.error(errorInfo);
    this.props.showError(error?.message, {
      onClose: () => {
        this.setState({ hasError: false });
      },
    });
  }

  render(): ReactNode {
    return this.props.children;
  }
}

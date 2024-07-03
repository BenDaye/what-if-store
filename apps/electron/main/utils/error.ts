// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const prettyError = (error: any): { error: Error } => {
  return {
    error:
      error instanceof Error
        ? error
        : typeof error === 'string'
          ? new Error(error)
          : new Error('UNEXPECTED_ERROR'),
  };
};

export const isDev = process.env.NODE_ENV !== 'production';

export const transformErrorToString = (error: unknown): string => {
  if (isDev) console.error(error);

  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'UNEXPECTED_ERROR';
};

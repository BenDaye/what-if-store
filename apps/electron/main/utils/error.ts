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

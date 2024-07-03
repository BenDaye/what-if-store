export type WingetChannelResult<T = unknown> =
  | { success: true; result: T }
  | { success: false; error: string };

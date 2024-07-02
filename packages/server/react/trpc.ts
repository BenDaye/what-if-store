import type { inferRouterOutputs } from '../server';
import type { AppRouter } from '../server/routers/_app';
import type { CreateTRPCReact } from './index';
import { createTRPCReact } from './index';

export const trpc: CreateTRPCReact<AppRouter, unknown> = createTRPCReact<AppRouter>();
export type RouterOutput = inferRouterOutputs<AppRouter>;

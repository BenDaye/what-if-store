import mitt, { Emitter } from 'mitt';
import { env } from './env';

type BaseEvents = {
  create: string;
  update: string;
  remove: string;
};

const mittGlobal = global as typeof global & {
  userEmitter?: Emitter<BaseEvents>;
  providerEmitter?: Emitter<BaseEvents>;
  applicationEmitter?: Emitter<BaseEvents>;
};

export const userEmitter = mittGlobal?.userEmitter ?? mitt<BaseEvents>();
export const providerEmitter =
  mittGlobal?.providerEmitter ?? mitt<BaseEvents>();
export const applicationEmitter =
  mittGlobal?.applicationEmitter ?? mitt<BaseEvents>();

if (env.NODE_ENV !== 'production') {
  mittGlobal.userEmitter = userEmitter;
  mittGlobal.providerEmitter = providerEmitter;
  mittGlobal.applicationEmitter = applicationEmitter;
}

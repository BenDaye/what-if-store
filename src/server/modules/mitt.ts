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
  applicationGroupEmitter?: Emitter<BaseEvents>;
  applicationCollectionEmitter?: Emitter<BaseEvents>;
  applicationTagEmitter?: Emitter<BaseEvents>;
};

// NOTE: User
export const userEmitter = mittGlobal?.userEmitter ?? mitt<BaseEvents>();
// NOTE: Provider
export const providerEmitter =
  mittGlobal?.providerEmitter ?? mitt<BaseEvents>();
// NOTE: Application
export const applicationEmitter =
  mittGlobal?.applicationEmitter ?? mitt<BaseEvents>();
export const applicationGroupEmitter =
  mittGlobal?.applicationGroupEmitter ?? mitt<BaseEvents>();
export const applicationCollectionEmitter =
  mittGlobal?.applicationCollectionEmitter ?? mitt<BaseEvents>();
export const applicationTagEmitter =
  mittGlobal?.applicationTagEmitter ?? mitt<BaseEvents>();

if (env.NODE_ENV !== 'production') {
  mittGlobal.userEmitter = userEmitter;
  mittGlobal.providerEmitter = providerEmitter;
  mittGlobal.applicationEmitter = applicationEmitter;
  mittGlobal.applicationGroupEmitter = applicationGroupEmitter;
  mittGlobal.applicationCollectionEmitter = applicationCollectionEmitter;
  mittGlobal.applicationTagEmitter = applicationTagEmitter;
}

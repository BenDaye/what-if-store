import mitt, { Emitter } from 'mitt';
import { env } from './env';

type BaseEvents = {
  create: string;
  update: string;
  remove: string;
};

const mittGlobal = global as typeof global & {
  userEmitter?: Emitter<BaseEvents>;
  authorEmitter?: Emitter<BaseEvents>;
  applicationEmitter?: Emitter<BaseEvents>;
};

export const userEmitter = mittGlobal?.userEmitter ?? mitt<BaseEvents>();
export const authorEmitter = mittGlobal?.authorEmitter ?? mitt<BaseEvents>();
export const applicationEmitter =
  mittGlobal?.applicationEmitter ?? mitt<BaseEvents>();

if (env.NODE_ENV !== 'production') {
  mittGlobal.userEmitter = userEmitter;
  mittGlobal.authorEmitter = authorEmitter;
  mittGlobal.applicationEmitter = applicationEmitter;
}

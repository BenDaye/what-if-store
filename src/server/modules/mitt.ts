import mitt, { Emitter } from 'mitt';
import { env } from './env';

type BaseEvents = {
  create: string;
  update: string;
  remove: string;
};

const mittGlobal = global as typeof global & {
  // user
  userEmitter?: Emitter<UserEvents>;
};

type UserEvents = BaseEvents;
export const userEmitter = mittGlobal?.userEmitter ?? mitt<UserEvents>();

if (env.NODE_ENV !== 'production') {
  // user
  mittGlobal.userEmitter = userEmitter;
}

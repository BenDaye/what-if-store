import type { Rectangle } from 'electron';
import type { Schema } from 'electron-store';
import { default as Store } from 'electron-store';
import { getPath } from '../utils';
import { MIN_HEIGHT, MIN_WIDTH } from '../window';

export type SchemaType = Rectangle;

const schema: Schema<SchemaType> = {
  x: { type: 'number', default: 0 },
  y: { type: 'number', default: 0 },
  width: { type: 'number', default: MIN_WIDTH },
  height: { type: 'number', default: MIN_HEIGHT },
};

export const store = new Store<SchemaType>({
  schema,
  name: 'window',
  cwd: getPath('userData'),
});

import path from 'path';
import {
  app,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  Rectangle,
  screen,
} from 'electron';
import { windowStore } from '../store';
import { MIN_HEIGHT, MIN_WIDTH } from './constants';

export const createWindow = (
  options: BrowserWindowConstructorOptions,
  useRecentBounds = true,
): BrowserWindow => {
  const primaryDisplayBounds = screen.getPrimaryDisplay().bounds;
  const width = options.width ?? MIN_WIDTH;
  const height = options.height ?? MIN_HEIGHT;
  const backgroundColor = options.backgroundColor ?? '#121212';
  const defaultBounds = {
    width,
    height,
    x:
      options.x ?? options.center
        ? (primaryDisplayBounds.width - width) / 2
        : 0,
    y:
      options.y ?? options.center
        ? (primaryDisplayBounds.height - height) / 2
        : 0,
  };
  const recentBounds: Rectangle = windowStore.store;

  const validBounds: Rectangle = useRecentBounds
    ? { ...recentBounds }
    : { ...defaultBounds };

  const windowWithinDisplayBounds = (
    windowBounds: Rectangle,
    displayBounds: Rectangle,
  ) => {
    return (
      windowBounds.x >= displayBounds.x &&
      windowBounds.y >= displayBounds.y &&
      windowBounds.x + windowBounds.width <=
        displayBounds.x + displayBounds.width &&
      windowBounds.y + windowBounds.height <=
        displayBounds.y + displayBounds.height
    );
  };

  const resizeToSafeBounds = (bounds: Rectangle): Rectangle => {
    bounds.x =
      bounds.x < primaryDisplayBounds.x
        ? options.center
          ? (primaryDisplayBounds.width - bounds.width) / 2
          : primaryDisplayBounds.x
        : bounds.x;

    bounds.y =
      bounds.y < primaryDisplayBounds.y
        ? options.center
          ? (primaryDisplayBounds.height - bounds.height) / 2
          : primaryDisplayBounds.y
        : bounds.y;

    bounds.width =
      primaryDisplayBounds.width < bounds.width
        ? options.minWidth
          ? options.minWidth
          : primaryDisplayBounds.width
        : bounds.width;

    bounds.height =
      primaryDisplayBounds.height < bounds.height
        ? options.minHeight
          ? options.minHeight
          : primaryDisplayBounds.height
        : bounds.height;

    return bounds;
  };

  const ensureVisibleOnSomeDisplay = (bounds: Rectangle): Rectangle => {
    const visible = screen.getAllDisplays().some((display) => {
      return windowWithinDisplayBounds(bounds, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resizeToSafeBounds(bounds);
    }
    return bounds;
  };

  const bounds = ensureVisibleOnSomeDisplay(validBounds);

  const saveBounds = () => {
    if (win.isMinimized() || win.isMaximized()) return;
    windowStore.set(win.getBounds());
  };

  const browserOptions: BrowserWindowConstructorOptions = {
    ...options,
    backgroundColor,
    ...bounds,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      ...options.webPreferences,
    },
  };

  const win = new BrowserWindow(browserOptions);

  win.once('focus', saveBounds);

  win.on('moved', saveBounds);

  win.on('resized', saveBounds);

  win.on('close', saveBounds);

  win.webContents.once('did-finish-load', () => {
    const isDev = process.env.NODE_ENV !== 'production';
    win.setTitle(
      `${isDev ? '[Dev] ' : ''}${app.getName()} ${app.getVersion()}`,
    );
  });

  return win;
};

import { app, BrowserWindow, Menu, nativeImage, Tray } from 'electron';
import { initializeWindow } from '../window';
import { appTitle } from './app';

export let tray: Tray;

export const initializeTray = () => {
  const trayIcon = nativeImage
    .createFromDataURL(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAAA5UlEQVR42u3ZsQ2EMBBEUZdASjvEboeYdohph5g24HJLF5x22MHcH8cgveALEKUwxhhjjDHG2Ldd5gMAAAAAALwAxv57oz3iMQaodkCNARY7YIkBNjtgiwEOO+DoO+FgxvURgNpzwsGM24TnlGfPrMu4TXhKAUyqjNuEzzKkAIZyajJuE97TXmB2TcZtwmsaYNVk7ElYmLEnYVnGroRlGfsSFmXsS1iUsS9hUca+hEUZXw87AAAAAADA858geqNfr7/9Dw0AAAAAAAAAAAAAAABsHzYAAAAAAKAvAGOMMcYYY+yt+wB0TwcPQ8n5CwAAAABJRU5ErkJggg==',
    )
    .resize({ width: 20, height: 20 });
  tray = new Tray(trayIcon);

  const showWindow = () => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length === 0) {
      initializeWindow();
    } else {
      windows.forEach((win) => win.show());
    }
  };

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Dashboard',
      click: () => showWindow(),
    },
    {
      type: 'separator',
    },
    {
      label: appTitle,
      enabled: false,
    },
    {
      type: 'separator',
    },
    {
      label: 'Quit',
      click: () => {
        BrowserWindow.getAllWindows().forEach((win) => win.close());
        app.quit();
      },
    },
  ]);

  tray.on('click', () => showWindow());

  tray.setToolTip('What If Store');
  tray.setContextMenu(contextMenu);
};

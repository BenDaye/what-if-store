import { app, BrowserWindow, Menu, nativeImage, Tray } from 'electron';
import { initializeWindow } from '../window';
import { client } from './bridge';

export let tray: Tray;

export const initializeTray = () => {
  const trayIcon = nativeImage
    .createFromDataURL(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAQAAABIkb+zAAAA5UlEQVR42u3ZsQ2EMBBEUZdASjvEboeYdohph5g24HJLF5x22MHcH8cgveALEKUwxhhjjDHG2Ldd5gMAAAAAALwAxv57oz3iMQaodkCNARY7YIkBNjtgiwEOO+DoO+FgxvURgNpzwsGM24TnlGfPrMu4TXhKAUyqjNuEzzKkAIZyajJuE97TXmB2TcZtwmsaYNVk7ElYmLEnYVnGroRlGfsSFmXsS1iUsS9hUca+hEUZXw87AAAAAADA858geqNfr7/9Dw0AAAAAAAAAAAAAAABsHzYAAAAAAKAvAGOMMcYYY+yt+wB0TwcPQ8n5CwAAAABJRU5ErkJggg==',
    )
    .resize({ width: 20, height: 20 });
  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Dashboard',
      click: async () => {
        const windows = BrowserWindow.getAllWindows();
        if (windows.length === 0) {
          await initializeWindow();
        } else {
          windows[0].show();
        }
      },
    },
    {
      label: 'Test Bridge',
      click: async () => {
        const res = await client.healthCheck.query();
        console.log(res);
      },
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setToolTip('What If Store');
  tray.setContextMenu(contextMenu);
};

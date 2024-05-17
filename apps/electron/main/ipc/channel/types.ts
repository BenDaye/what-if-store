import { app } from 'electron';

export abstract class IpcChannel {
  protected abstract create(): void;
  protected abstract destroy(): void;

  initialize(): void {
    this.create();
    app.once('before-quit', () => this.destroy());
  }
}

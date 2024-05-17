import { powerSaveBlocker } from 'electron';

export let powerSaveBlockerId: number | null = null;

export const startPowerSaveBlocker = (): void => {
  powerSaveBlockerId = powerSaveBlocker.start('prevent-display-sleep');
};

export const stopPowerSaveBlocker = (): void => {
  if (powerSaveBlockerId !== null) {
    powerSaveBlocker.stop(powerSaveBlockerId);
  }
  powerSaveBlockerId = null;
};
